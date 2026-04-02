import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

type Phase = 'work' | 'rest' | 'idle';

export default function HiitTimerScreen() {
  const [workSeconds, setWorkSeconds] = useState(30);
  const [restSeconds, setRestSeconds] = useState(15);
  const [rounds, setRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setPhase('idle');
    setCurrentRound(0);
    setTimeLeft(0);
  }, []);

  const start = useCallback(() => {
    stop();
    setCurrentRound(1);
    setPhase('work');
    setTimeLeft(workSeconds);

    let round = 1;
    let remaining = workSeconds;
    let currentPhase: Phase = 'work';

    intervalRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        if (currentPhase === 'work') {
          currentPhase = 'rest';
          remaining = restSeconds;
        } else {
          round += 1;
          if (round > rounds) {
            stop();
            return;
          }
          currentPhase = 'work';
          remaining = workSeconds;
        }
        setCurrentRound(round);
        setPhase(currentPhase);
      }
      setTimeLeft(remaining);
    }, 1000);
  }, [workSeconds, restSeconds, rounds, stop]);

  const phaseColor = phase === 'work' ? APP_COLORS.error : phase === 'rest' ? APP_COLORS.success : APP_COLORS.primary;

  function adjust(setter: React.Dispatch<React.SetStateAction<number>>, delta: number, min: number) {
    setter((v) => Math.max(min, v + delta));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>HIIT Timer</Text>

      {phase === 'idle' ? (
        <View style={styles.settings}>
          <SettingRow label="Work" value={`${workSeconds}s`} onMinus={() => adjust(setWorkSeconds, -5, 5)} onPlus={() => adjust(setWorkSeconds, 5, 5)} />
          <SettingRow label="Rest" value={`${restSeconds}s`} onMinus={() => adjust(setRestSeconds, -5, 5)} onPlus={() => adjust(setRestSeconds, 5, 5)} />
          <SettingRow label="Rounds" value={`${rounds}`} onMinus={() => adjust(setRounds, -1, 1)} onPlus={() => adjust(setRounds, 1, 1)} />
        </View>
      ) : (
        <View style={styles.timerDisplay}>
          <Text style={styles.roundLabel}>Round {currentRound} / {rounds}</Text>
          <Text style={[styles.phaseLabel, { color: phaseColor }]}>{phase.toUpperCase()}</Text>
          <Text style={[styles.timer, { color: phaseColor }]}>{timeLeft}</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.button, { backgroundColor: phase === 'idle' ? APP_COLORS.primary : APP_COLORS.error }]} onPress={phase === 'idle' ? start : stop}>
        <Text style={styles.buttonText}>{phase === 'idle' ? 'Start' : 'Stop'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function SettingRow({ label, value, onMinus, onPlus }: { label: string; value: string; onMinus: () => void; onPlus: () => void }) {
  return (
    <View style={setStyles.row}>
      <Text style={setStyles.label}>{label}</Text>
      <View style={setStyles.controls}>
        <TouchableOpacity style={setStyles.btn} onPress={onMinus}><Text style={setStyles.btnText}>–</Text></TouchableOpacity>
        <Text style={setStyles.value}>{value}</Text>
        <TouchableOpacity style={setStyles.btn} onPress={onPlus}><Text style={setStyles.btnText}>+</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const setStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border },
  label: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: APP_COLORS.text },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  btn: { width: 40, height: 40, borderRadius: 20, backgroundColor: APP_COLORS.surface, borderWidth: 1, borderColor: APP_COLORS.border, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 20, color: APP_COLORS.primary, fontWeight: '700' },
  value: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: APP_COLORS.text, minWidth: 50, textAlign: 'center' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background, padding: SPACING.lg },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.lg, textAlign: 'center' },
  settings: { backgroundColor: APP_COLORS.surface, borderRadius: 14, padding: SPACING.lg, marginBottom: SPACING.xl },
  timerDisplay: { alignItems: 'center', paddingVertical: 60 },
  roundLabel: { fontSize: FONT_SIZES.lg, color: APP_COLORS.textSecondary, marginBottom: 8 },
  phaseLabel: { fontSize: FONT_SIZES.xxl, fontWeight: '800', marginBottom: 16 },
  timer: { fontSize: 96, fontWeight: '900' },
  button: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 'auto' },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.xl, fontWeight: '700' },
});
