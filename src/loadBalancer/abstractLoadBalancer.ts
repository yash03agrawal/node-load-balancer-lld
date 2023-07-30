import { NextFunction, Request, Response } from 'express';
import Server from '../server/server';
import ILoadBalancer from './loadBalancer';

export default abstract class AbstractLoadBalancer implements ILoadBalancer {
  protected capacity: number;
  protected registeredServers: Set<Server>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.registeredServers = new Set<Server>();
  }

  registerServer = (server: Server): void => {
    if (server.isRegistered) {
      throw new Error('server is already registered');
    }

    if (this.registeredServers.size >= this.capacity) {
      throw new Error('max capacity for servers has reached');
    }

    server.isRegistered = true;
    this.registeredServers.add(server);
  };

  unregisterServer = (ipAddress: string): void => {
    let server: Server | null = null;
    for (let s of this.registeredServers) {
      if (s.ipAddress === ipAddress) {
        server = s;
        break;
      }
    }

    if (!server?.isRegistered) {
      throw new Error('server is not registered');
    }

    server.isRegistered = false;
    this.registeredServers.delete(server);
  };

  getRegisteredServers = (): Set<Server> => {
    return this.registeredServers;
  };

  protected checkForServers = (next: NextFunction) => {
    if (this.registeredServers.size === 0) {
      next(new Error('no server to handle request'));
    }
  };

  abstract balanceLoad: (req: Request, res: Response, next: NextFunction) => void;
}
