import express from 'express';
import { ErrorHandler } from './errorhandler';
import LoadBalancerFactory from './loadBalancerFactory/loadBalancerFactory';
import Server, { TServer } from './server/server';
import ServerBuilder from './server/serverBuilder';

const app = express();
app.use(express.json());
const globalRouter = express.Router();
const serverRegisterRouter = express.Router();

const loadBalancerFactory: LoadBalancerFactory = new LoadBalancerFactory();
const loadBalancer = loadBalancerFactory.getLoadBalancer('least-connection', 3);

/**
 * api to create
 * and register new
 * server to LB
 */
serverRegisterRouter.post('/register', async (req, res, next) => {
  try {
    const data: TServer = req.body;
    const server: Server = new ServerBuilder()
      .setIpAddress(data.ipAddress)
      .setName(data.name)
      .setIsRegistered(data.isRegistered)
      .setActiveConnections(data.activeConnections)
      .build();
    loadBalancer.registerServer(server);

    return res.status(200).json({
      message: 'server successfully created and registered'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * api to unregister
 * server to LB
 */
serverRegisterRouter.delete('/unregister', async (req, res, next) => {
  try {
    const ipAddress: string = req.query.ipAddress.toString();
    loadBalancer.unregisterServer(ipAddress);
    return res.status(200).json({
      message: 'server successfully unregistered'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * sample apis which
 * goes through LB
 * and have assigned server
 * as their request property
 */
globalRouter.get('/sample-request', async (req, res, next) => {
  try {
    console.log('sample request');
    const serverAssigned: Server = req.body.server;
    console.log('server assigned: ', serverAssigned.ipAddress);
    // completing this task after 5sec
    setTimeout(() => {
      serverAssigned.connectionComplete();
    }, 5000);
    return res.status(200).json({
      message: 'success'
    });
  } catch (error) {
    next(error);
  }
});

app.use('/server', serverRegisterRouter);
app.use('/api', loadBalancer.balanceLoad, globalRouter);
app.use(ErrorHandler);

export default app;
