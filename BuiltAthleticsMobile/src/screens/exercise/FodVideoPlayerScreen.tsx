import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode, Audio, type AVPlaybackStatus } from 'expo-av';
import type { ExerciseScreenProps } from '../../navigation/types';
import * as fod from '../../api/fod';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

const PROGRESS_INTERVAL_MS = 30_000;

export default function FodVideoPlayerScreen({
  route,
  navigation,
}: ExerciseScreenProps<'FodVideoPlayer'>) {
  const { videoId, title } = route.params;
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const positionSecRef = useRef(0);
  const eventIdRef = useRef<string | null>(null);

  const sendProgress = useCallback(async () => {
    const eid = eventIdRef.current;
    if (!eid) return;
    const sec = Math.max(0, Math.floor(positionSecRef.current));
    try {
      await fod.fodPlaybackProgress({
        eventHistoryId: eid,
        watchProgress: sec,
      });
    } catch {
      // non-fatal telemetry
    }
  }, []);

  const sendEnd = useCallback(async () => {
    const eid = eventIdRef.current;
    if (!eid) return;
    try {
      await fod.fodPlaybackEnd({ eventHistoryId: eid });
    } catch {
      // ignore
    }
    eventIdRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    let progressTimer: ReturnType<typeof setInterval> | undefined;

    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
      } catch {
        // ignore
      }

      try {
        const s = await fod.startFodPlayback(videoId);
        if (cancelled) return;
        eventIdRef.current = s.eventHistoryId;
        setStreamUrl(s.streamUrl);
        progressTimer = setInterval(sendProgress, PROGRESS_INTERVAL_MS);
      } catch (e) {
        if (!cancelled) {
          setError((e as { message?: string })?.message ?? 'Could not start playback');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (progressTimer) clearInterval(progressTimer);
      void sendEnd();
    };
  }, [videoId, sendProgress, sendEnd]);

  const onStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      positionSecRef.current = status.positionMillis / 1000;
      if (status.didJustFinish) {
        void sendEnd();
        navigation.goBack();
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <ActivityIndicator size="large" color={APP_COLORS.primary} />
        <Text style={styles.muted}>Loading video…</Text>
      </SafeAreaView>
    );
  }

  if (error || !streamUrl) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <Text style={styles.error}>{error ?? 'Missing stream URL'}</Text>
        <Text style={styles.muted}>
          Your account must be invited in Fitness On Demand FLEX for this email.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Video
        style={styles.video}
        source={{ uri: streamUrl }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        onPlaybackStatusUpdate={onStatusUpdate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  video: { flex: 1, width: '100%' },
  title: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  muted: {
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.sm,
  },
  error: {
    color: '#c62828',
    textAlign: 'center',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  btn: {
    marginTop: SPACING.lg,
    backgroundColor: APP_COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontWeight: '600' },
});
