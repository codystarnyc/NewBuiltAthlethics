import { imageApiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ImageUploadResponse, ProcessingResult, ImageType } from './types';

interface ApiEnvelope<T> {
  status: boolean;
  data: T;
}

export async function uploadImage(
  uri: string,
  type: ImageType = 'food',
): Promise<ImageUploadResponse> {
  const formData = new FormData();

  const filename = uri.split('/').pop() ?? 'image.jpg';
  const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';

  formData.append('image', {
    uri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);

  formData.append('type', type);

  const res = await imageApiClient.post<ApiEnvelope<ImageUploadResponse>>(
    ENDPOINTS.imageUpload.upload,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return res.data.data;
}

export async function uploadExerciseVideo(
  uri: string,
): Promise<ImageUploadResponse> {
  const formData = new FormData();

  const filename = uri.split('/').pop() ?? 'video.mp4';

  formData.append('video', {
    uri,
    name: filename,
    type: 'video/mp4',
  } as unknown as Blob);

  const res = await imageApiClient.post<ApiEnvelope<ImageUploadResponse>>(
    ENDPOINTS.imageUpload.uploadVideo,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return res.data.data;
}

export async function getProcessingResult(id: string): Promise<ProcessingResult> {
  const res = await imageApiClient.get<ApiEnvelope<ProcessingResult>>(
    `${ENDPOINTS.imageUpload.results}/${id}`,
  );
  return res.data.data;
}

export async function listProcessingResults(): Promise<ProcessingResult[]> {
  const res = await imageApiClient.get<ApiEnvelope<ProcessingResult[]>>(
    ENDPOINTS.imageUpload.results,
  );
  return res.data.data;
}
