import { NextFunction, Request, Response } from 'express';
import Server from '../server/server';
import AbstractLoadBalancer from './abstractLoadBalancer';
import ILoadBalancer from './loadBalancer';

export default class LeastConnectionLoadBalancer
  extends AbstractLoadBalancer
  implements ILoadBalancer
{
  /**
   * the server having the
   * least amount of active
   * connection will be returned
   * @param req
   */
  balanceLoad = (req: Request, res: Response, next: NextFunction): void => {
    this.checkForServers(next);

    let selectedServer: Server | null = null;
    let minConnection: number = Number.MAX_VALUE;
    for (let server of this.registeredServers) {
      if (server.activeConnections <= minConnection) {
        minConnection = server.activeConnections;
        selectedServer = server;
      }
    }
    if (selectedServer) {
      selectedServer.activeConnections = selectedServer.activeConnections + 1;
    }
    req.body.server = selectedServer;
    next();
  };
}
