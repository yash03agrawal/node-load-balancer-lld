import Server, { TServer } from './server';

export default class ServerBuilder {
  ipAddress: string;
  name: string;
  isRegistered: boolean;
  activeConnections: number;

  constructor() {
    this.ipAddress = '';
    this.name = '';
    this.isRegistered = false;
    this.activeConnections = 0;
  }

  setIpAddress = (ipAddress: string): ServerBuilder => {
    if (ipAddress) this.ipAddress = ipAddress;
    return this;
  };

  setName = (name: string): ServerBuilder => {
    if (name) this.name = name;
    return this;
  };

  setIsRegistered = (isRegistered: boolean): ServerBuilder => {
    if (isRegistered !== undefined || isRegistered !== null) this.isRegistered = isRegistered;
    return this;
  };

  setActiveConnections = (activeConnections: number): ServerBuilder => {
    if (activeConnections) this.activeConnections = activeConnections;
    return this;
  };

  build = (): Server => {
    const data: TServer = {
      ipAddress: this.ipAddress,
      name: this.name,
      isRegistered: this.isRegistered,
      activeConnections: this.activeConnections
    };
    return new Server(data);
  };
}
