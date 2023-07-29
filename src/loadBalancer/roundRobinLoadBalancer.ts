import { NextFunction, Request, Response } from 'express';
import Server from '../server/server';
import AbstractLoadBalancer from './abstractLoadBalancer';
import ILoadBalancer from './loadBalancer';

export default class RoundRobinLoadBalancer extends AbstractLoadBalancer implements ILoadBalancer {
  private lastSelectedServer: number | undefined = undefined;

  /**
   * the server will be
   * returned in a round robin
   * manner
   * @param req
   * @returns
   */
  balanceLoad = (req: Request, res: Response, next: NextFunction): void => {
    this.checkForServers(next);

    let selectedServer: Server | null = null;
    if (this.lastSelectedServer === undefined) {
      this.lastSelectedServer = this.registeredServers.size - 1;
    }
    const newSelection = (this.lastSelectedServer + 1) % this.registeredServers.size;
    selectedServer = Array.from(this.registeredServers)?.[newSelection];
    this.lastSelectedServer = newSelection;
    req.body.server = selectedServer;
    next();
  };
}
