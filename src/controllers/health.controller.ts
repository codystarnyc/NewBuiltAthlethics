import type { Request, Response } from 'express';
import { success } from '../utils/response';

export function healthCheck(_req: Request, res: Response) {
  success(res, {
    service: 'ImageUploadAPI',
    version: '2.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
