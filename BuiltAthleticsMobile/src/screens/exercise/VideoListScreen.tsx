import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ExerciseScreenProps } from '../../navigation/types';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import { useFodCatalog } from '../../hooks/useFodCatalog';

export default function VideoListScreen({ navigation }: ExerciseScreenProps<'VideoList'>) {
  const { data: classes = [], isPending, isError, error, refetch, isRefetching } = useFodCatalog();

  if (isPending && classes.length === 0) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <ActivityIndicator size="large" color={APP_COLORS.primary} />
        <Text style={styles.muted}>Loading classes…</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <Text style={styles.error}>Could not load classes</Text>
        <Text style={styles.muted}>
          {(error as { message?: string })?.message ?? 'Check login and FLEX access for your email.'}
        </Text>
        <TouchableOpacity style={styles.retry} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={classes ?? []}
        keyExtractor={(item) => String(item.videoId)}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={APP_COLORS.primary} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No classes returned. Confirm your FOD catalog and API URL.</Text>
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('FodVideoPlayer', { videoId: item.videoId, title: item.title })
            }
          >
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.thumbImage} resizeMode="cover" />
            ) : (
              <View style={styles.thumbnail}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            )}
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.meta} numberOfLines={1}>
                {[item.subtitle, item.durationLabel].filter(Boolean).join(' · ') || 'Tap to play'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  centered: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  list: { padding: SPACING.lg, flexGrow: 1 },
  card: {
    flexDirection: 'row',
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 90,
    height: 70,
    backgroundColor: APP_COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: { width: 90, height: 70, backgroundColor: APP_COLORS.surface },
  playIcon: { fontSize: 24, color: APP_COLORS.primary },
  info: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  title: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
  meta: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 4 },
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
  retry: {
    marginTop: SPACING.lg,
    backgroundColor: APP_COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  retryText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: APP_COLORS.textSecondary, marginTop: SPACING.xl },
});
