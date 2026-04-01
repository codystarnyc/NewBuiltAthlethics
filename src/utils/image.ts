import axios from 'axios';

export async function fetchImageAsBase64(
  imageUrl: string,
): Promise<{ data: string; mimeType: string }> {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

  const contentType =
    (response.headers['content-type'] as string) ?? 'image/jpeg';
  const mimeType = contentType.split(';')[0].trim();
  const data = Buffer.from(response.data as ArrayBuffer).toString('base64');

  return { data, mimeType };
}
