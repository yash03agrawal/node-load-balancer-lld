import Server, { TServer } from '../../src/server/server';
import ServerBuilder from '../../src/server/serverBuilder';

const data1: TServer = {
  ipAddress: '121',
  name: 'server1',
  isRegistered: true,
  activeConnections: 1
};

const data2: TServer = {
  ipAddress: '122',
  name: 'server2',
  isRegistered: false,
  activeConnections: 0
};

describe('ServerBuilder', () => {
  test('build server1', () => {
    const expectedServer: Server = new Server(data1);
    const server: Server = new ServerBuilder()
      .setIpAddress('121')
      .setName('server1')
      .setIsRegistered(true)
      .setActiveConnections(1)
      .build();

    expect(JSON.stringify(server)).toBe(JSON.stringify(expectedServer));
  });

  test('build server2', () => {
    const expectedServer: Server = new Server(data2);
    const server: Server = new ServerBuilder().setIpAddress('122').setName('server2').build();

    expect(JSON.stringify(server)).toBe(JSON.stringify(expectedServer));
  });
});
