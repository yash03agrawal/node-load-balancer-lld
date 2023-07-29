import { NextFunction, Request, Response } from 'express';
import Server from '../server/server';

/**
 * only public methods
 * in interfaces
 */
export default interface ILoadBalancer {
  registerServer: (server: Server) => void;
  unregisterServer: (ipAddress: string) => void;
  balanceLoad: (req: Request, res: Response, next: NextFunction) => void;
}
