import type { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { success } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { env } from '../config/env';
import { getFlexSession, clearFlexSessionCache } from '../services/fitnessOnDemand/flexSession';
import { getBrightcoveHlsUrl } from '../services/fitnessOnDemand/brightcovePlayback';

function flexBase(): string {
  return env.fitnessOnDemand.flexUrl.replace(/\/$/, '');
}

async function flexHeaders(email: string): Promise<{ Authorization: string }> {
  const s = await getFlexSession(email);
  return { Authorization: `Bearer ${s.idToken}` };
}

/** Session + Brightcove ids for debugging / advanced clients (idToken is short-lived). */
export async function getFodSession(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user!.email;
    const session = await getFlexSession(email);
    success(res, {
      accountId: session.accountId,
      playerId: session.playerId,
      policyKey: session.policyKey,
      idToken: session.idToken,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /classes/list — proxy FOD catalog */
export async function listFodClasses(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user!.email;
    const headers = await flexHeaders(email);
    const url = `${flexBase()}/classes/list`;
    const { data, status } = await axios.get(url, {
      headers: { ...headers, Accept: 'application/json', 'Accept-Encoding': 'gzip' },
      timeout: 45_000,
      validateStatus: () => true,
    });
    if (status === 401) {
      clearFlexSessionCache(email);
      throw new AppError(502, 'FOD session expired — retry');
    }
    if (status !== 200) {
      throw new AppError(502, typeof data === 'object' && data && 'message' in data ? String((data as { message: string }).message) : `FOD list failed (${status})`);
    }
    success(res, data);
  } catch (err) {
    next(err);
  }
}

/** Start play event + return HLS stream URL for native playback */
export async function startFodPlayback(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user!.email;
    const videoId = Number(req.body?.videoId);
    if (!Number.isFinite(videoId)) throw new AppError(400, 'videoId is required');

    const session = await getFlexSession(email);
    const auth = { Authorization: `Bearer ${session.idToken}` };
    const playUrl = `${flexBase()}/classes/play`;
    const startTime = new Date().toISOString();

    const { data: playData, status: playStatus } = await axios.post(
      playUrl,
      { videoId, startTime },
      {
        headers: { ...auth, 'Content-Type': 'application/json', Accept: 'application/json' },
        timeout: 30_000,
        validateStatus: () => true,
      },
    );

    if (playStatus === 401) {
      clearFlexSessionCache(email);
      throw new AppError(502, 'FOD session expired — retry');
    }

    const raw = playData as Record<string, unknown>;
    const nested = raw.data as Record<string, unknown> | undefined;
    const inner = nested?.data as Record<string, unknown> | undefined;
    const eventId =
      (typeof raw.eventHistoryId === 'string' ? raw.eventHistoryId : undefined) ??
      (nested && typeof nested.eventHistoryId === 'string' ? nested.eventHistoryId : undefined) ??
      (inner && typeof inner.eventHistoryId === 'string' ? inner.eventHistoryId : undefined);
    if (!eventId) {
      throw new AppError(
        502,
        (raw.message as string | undefined) ?? 'FOD play did not return eventHistoryId',
      );
    }

    const streamUrl = await getBrightcoveHlsUrl(session.accountId, session.policyKey, videoId);
    if (!streamUrl) {
      throw new AppError(502, 'Could not resolve Brightcove HLS URL for this video');
    }

    success(res, {
      eventHistoryId: eventId,
      streamUrl,
      videoId,
      startTime,
    });
  } catch (err) {
    next(err);
  }
}

export async function fodPlayProgress(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user!.email;
    const headers = await flexHeaders(email);
    const url = `${flexBase()}/classes/playprogress`;
    const { data, status } = await axios.post(url, req.body, {
      headers: { ...headers, 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 30_000,
      validateStatus: () => true,
    });
    if (status === 401) {
      clearFlexSessionCache(email);
      throw new AppError(502, 'FOD session expired');
    }
    if (status < 200 || status >= 300) {
      throw new AppError(502, JSON.stringify(data).slice(0, 200));
    }
    success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function fodEndEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user!.email;
    const headers = await flexHeaders(email);
    const url = `${flexBase()}/classes/endevent`;
    const { data, status } = await axios.post(url, req.body, {
      headers: { ...headers, 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 30_000,
      validateStatus: () => true,
    });
    if (status === 401) {
      clearFlexSessionCache(email);
      throw new AppError(502, 'FOD session expired');
    }
    if (status < 200 || status >= 300) {
      throw new AppError(502, JSON.stringify(data).slice(0, 200));
    }
    success(res, data);
  } catch (err) {
    next(err);
  }
}
