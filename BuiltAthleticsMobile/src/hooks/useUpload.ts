import { useMutation, useQuery } from '@tanstack/react-query';
import * as uploadApi from '../api/upload';
import type { ImageType, ProcessingResult } from '../api/types';

export function useImageUpload() {
  return useMutation({
    mutationFn: ({ uri, type }: { uri: string; type?: ImageType }) =>
      uploadApi.uploadImage(uri, type),
  });
}

export function useVideoUpload() {
  return useMutation({
    mutationFn: (uri: string) => uploadApi.uploadExerciseVideo(uri),
  });
}

export function useProcessingResult(id: string | null) {
  return useQuery<ProcessingResult>({
    queryKey: ['processingResult', id],
    queryFn: () => uploadApi.getProcessingResult(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') return false;
      return 2000;
    },
  });
}

export function useProcessingResults() {
  return useQuery<ProcessingResult[]>({
    queryKey: ['processingResults'],
    queryFn: () => uploadApi.listProcessingResults(),
  });
}
