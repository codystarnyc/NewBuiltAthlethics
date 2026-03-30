import type { Response } from 'express';

export function success<T>(res: Response, data: T, extra?: Record<string, unknown>) {
  res.json({ status: true, data, ...extra });
}

export function fail(res: Response, message: string, statusCode = 500) {
  res.status(statusCode).json({ status: false, message });
}

export function created<T>(res: Response, data: T) {
  res.status(201).json({ status: true, data });
}
