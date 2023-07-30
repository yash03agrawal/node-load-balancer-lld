import { Request, Response } from 'express';
import LeastConnectionLoadBalancer from '../../src/loadBalancer/leastConnectionLoadBalancer';
import ILoadBalancer from '../../src/loadBalancer/loadBalancer';
import Server, { TServer } from '../../src/server/server';

const data1: TServer = {
  ipAddress: '121',
  name: 'server1',
  isRegistered: false,
  activeConnections: 0
};

const data2: TServer = {
  ipAddress: '122',
  name: 'server2',
  isRegistered: false,
  activeConnections: 0
};

const data3: TServer = {
  ipAddress: '123',
  name: 'server3',
  isRegistered: false,
  activeConnections: 0
};

const data4: TServer = {
  ipAddress: '124',
  name: 'server4',
  isRegistered: false,
  activeConnections: 0
};

const verifyRegisteredServers = (lb: ILoadBalancer, ipAddressesList: Array<string>): void => {
  let k: number = 0;
  for (let server of lb.getRegisteredServers()) {
    expect(server.ipAddress).toBe(ipAddressesList[k++]);
  }
};

describe('LeastConnectionLoadBalancer', () => {
  const server1: Server = new Server(data1);
  const server2: Server = new Server(data2);
  const server3: Server = new Server(data3);
  const server4: Server = new Server(data4);

  beforeEach(() => {
    server1.isRegistered = false;
    server2.isRegistered = false;
    server3.isRegistered = false;
    server4.isRegistered = false;
  });

  test('.registerServer', () => {
    const lb: ILoadBalancer = new LeastConnectionLoadBalancer(3);
    lb.registerServer(server1);
    verifyRegisteredServers(lb, ['121']);

    lb.registerServer(server2);
    verifyRegisteredServers(lb, ['121', '122']);

    lb.registerServer(server3);
    verifyRegisteredServers(lb, ['121', '122', '123']);

    expect(() => {
      lb.registerServer(server4);
    }).toThrow('max capacity for servers has reached');

    expect(() => {
      lb.registerServer(server1);
    }).toThrow('server is already registered');
  });

  test('.unregisterServer', () => {
    const lb: ILoadBalancer = new LeastConnectionLoadBalancer(3);
    lb.registerServer(server1);
    lb.registerServer(server2);
    lb.registerServer(server3);

    lb.unregisterServer('121');
    verifyRegisteredServers(lb, ['122', '123']);

    lb.unregisterServer('123');
    verifyRegisteredServers(lb, ['122']);

    expect(() => {
      lb.unregisterServer('124');
    }).toThrow('server is not registered');
  });

  test('.getRegisteredServers', () => {
    const lb: ILoadBalancer = new LeastConnectionLoadBalancer(4);
    lb.registerServer(server1);
    lb.registerServer(server2);
    lb.registerServer(server3);
    lb.registerServer(server4);

    const serverSet: Set<Server> = new Set<Server>();
    serverSet.add(server1);
    serverSet.add(server2);
    serverSet.add(server3);
    serverSet.add(server4);

    expect(Array.from(lb.getRegisteredServers()).map(x => x.ipAddress)).toEqual(
      Array.from(serverSet).map(x => x.ipAddress)
    );
  });

  test('.balanceLoad', () => {
    const lb: ILoadBalancer = new LeastConnectionLoadBalancer(3);
    lb.registerServer(server1);
    lb.registerServer(server2);
    lb.registerServer(server3);

    /**
     * increasing active connections
     * count on other servers so to
     * test that request is allocated
     * to server3
     */
    server1.activeConnections = 2;
    server2.activeConnections = 2;

    /**
     * mocking balanceLoad
     * params
     */
    const mockRequest = {
      body: {}
    } as Request;
    const mockResponse = {} as Response;
    const mockNext = () => {};

    lb.balanceLoad(mockRequest, mockResponse, mockNext);
    expect(mockRequest.body.server).toEqual(server3);

    /**
     * this is not required
     * kept here for future
     * reference
     */
    const mockNextToThrow = jest.fn().mockImplementation(() => {
      throw new Error('no server to handle request');
    });

    lb.unregisterServer('121');
    lb.unregisterServer('122');
    lb.unregisterServer('123');

    lb.balanceLoad(mockRequest, mockResponse, mockNext);
    expect(mockRequest.body.server).toEqual(null);
  });
});
