import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

interface ApiEnvelope<T> {
  status: boolean;
  data: T;
}

export interface FodListItem {
  videoId: number;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  durationLabel?: string;
}

export interface FodPlaybackStart {
  eventHistoryId: string;
  streamUrl: string;
  videoId: number;
  startTime: string;
}

function pickNumber(...vals: unknown[]): number | undefined {
  for (const v of vals) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
}

function formatDurationLabel(v: unknown): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim();
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function extractRows(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const o = payload as Record<string, unknown>;
    for (const key of ['data', 'classes', 'items', 'list', 'results']) {
      const v = o[key];
      if (Array.isArray(v)) return v;
      if (v && typeof v === 'object') {
        const inner = (v as Record<string, unknown>).data;
        if (Array.isArray(inner)) return inner;
      }
    }
  }
  return [];
}

/** Normalize FOD /flex/v1/classes/list payloads (shape varies by tenant). */
export function normalizeFodClasses(payload: unknown): FodListItem[] {
  const rows = extractRows(payload);
  const out: FodListItem[] = [];
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    const videoId = pickNumber(r.videoId, r.videoID, r.VideoId, r.id, r.classId);
    if (videoId === undefined) continue;
    const title = String(
      r.title ?? r.name ?? r.className ?? r.programName ?? r.Title ?? 'Class',
    );
    out.push({
      videoId,
      title,
      subtitle:
        r.categoryName != null
          ? String(r.categoryName)
          : r.instructor != null
            ? String(r.instructor)
            : undefined,
      imageUrl:
        r.thumbnailUrl != null
          ? String(r.thumbnailUrl)
          : r.imageUrl != null
            ? String(r.imageUrl)
            : r.thumbnail != null
              ? String(r.thumbnail)
              : undefined,
      durationLabel: formatDurationLabel(r.duration ?? r.durationSeconds ?? r.length ?? r.Duration),
    });
  }
  return out;
}

/** Raw FOD list response (passed through from backend). */
export async function fetchFodClassesRaw(): Promise<unknown> {
  const res = await apiClient.get<ApiEnvelope<unknown>>(ENDPOINTS.fod.classes, { timeout: 60_000 });
  return res.data.data;
}

export async function startFodPlayback(videoId: number): Promise<FodPlaybackStart> {
  const res = await apiClient.post<ApiEnvelope<FodPlaybackStart>>(ENDPOINTS.fod.playbackStart, { videoId }, { timeout: 60_000 });
  return res.data.data;
}

/** Forward telemetry to FOD; body must match your FLEX Playback doc (e.g. watchProgress in seconds). */
export async function fodPlaybackProgress(body: Record<string, unknown>): Promise<void> {
  await apiClient.post(ENDPOINTS.fod.playbackProgress, body, { timeout: 30_000 });
}

export async function fodPlaybackEnd(body: Record<string, unknown>): Promise<void> {
  await apiClient.post(ENDPOINTS.fod.playbackEnd, body, { timeout: 30_000 });
}
