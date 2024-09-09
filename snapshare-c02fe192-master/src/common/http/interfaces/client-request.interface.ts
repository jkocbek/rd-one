import type { Request } from 'express';

export interface ClientRequest extends Request {
  userId?: string;
  requestId: string;
  requestStart: [number, number];
}
