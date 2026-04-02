import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE, IMAGE_API_BASE } from './endpoints';
import { getAuthToken } from '../utils/storage';
import type { ApiError } from './types';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const imageApiClient = axios.create({
  baseURL: IMAGE_API_BASE,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
});

async function injectAuthToken(config: InternalAxiosRequestConfig) {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

apiClient.interceptors.request.use(injectAuthToken);
imageApiClient.interceptors.request.use(injectAuthToken);

function handleResponseError(error: AxiosError<ApiError>) {
  if (error.response) {
    const apiError: ApiError = {
      message: error.response.data?.message ?? error.message,
      code: error.response.data?.code,
      status: error.response.status,
    };
    return Promise.reject(apiError);
  }

  if (error.request) {
    return Promise.reject({
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
    } satisfies ApiError);
  }

  return Promise.reject({
    message: error.message,
    code: 'UNKNOWN_ERROR',
  } satisfies ApiError);
}

apiClient.interceptors.response.use((res) => res, handleResponseError);
imageApiClient.interceptors.response.use((res) => res, handleResponseError);
