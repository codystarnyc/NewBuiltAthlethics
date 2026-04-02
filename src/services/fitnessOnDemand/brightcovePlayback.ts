import axios from 'axios';

interface PlaybackSource {
  src?: string;
  type?: string;
}

interface PlaybackVideo {
  sources?: PlaybackSource[];
}

/**
 * Resolve an HLS URL for a FOD / Brightcove reference id (full class, not preview).
 * @see FOD FLEX Playback API — Brightcove native SDK section
 */
export async function getBrightcoveHlsUrl(
  accountId: string,
  policyKey: string,
  videoReferenceId: string | number,
): Promise<string | null> {
  const ref = String(videoReferenceId);
  const url = `https://edge.api.brightcove.com/playback/v1/accounts/${accountId}/videos/ref:${ref}`;
  const { data, status } = await axios.get<PlaybackVideo>(url, {
    headers: {
      Accept: `application/json;pk=${policyKey}`,
    },
    timeout: 25_000,
    validateStatus: () => true,
  });

  if (status !== 200 || !data?.sources?.length) return null;

  const hls = data.sources.find(
    (s) =>
      s.type === 'application/x-mpegURL' ||
      (s.src && (s.src.includes('.m3u8') || s.type?.includes('mpegURL'))),
  );
  return hls?.src ?? null;
}
