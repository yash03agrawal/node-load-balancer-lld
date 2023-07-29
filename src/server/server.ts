export type TServer = {
  ipAddress?: string;
  name?: string;
  isRegistered?: boolean;
  activeConnections?: number;
};

export default class Server {
  ipAddress: string;
  name: string;
  isRegistered: boolean;
  activeConnections: number;

  constructor(data: TServer) {
    this.ipAddress = data.ipAddress;
    this.name = data.name;
    this.isRegistered = data.isRegistered;
    this.activeConnections = data.activeConnections;
  }

  connectionComplete = (): void => {
    this.activeConnections = --this.activeConnections;
  };
}
