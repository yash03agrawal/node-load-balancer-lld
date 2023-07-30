import Server, { TServer } from '../../src/server/server';

describe('Server', () => {
  const data: TServer = {
    ipAddress: '121',
    name: 'server1',
    isRegistered: false,
    activeConnections: 0
  };
  test('.connectionComplete', () => {
    const server: Server = new Server(data);
    server.activeConnections = 2;
    server.connectionComplete();
    expect(server.activeConnections).toBe(1);
  });
});
