import request from 'supertest';
import app from '../src/app';
import { TServer } from '../src/server/server';

let server;

const startServer = () => {
  server = app.listen(3000, () => {
    console.log('server started...');
  });
};

const stopServer = () => {
  server.close();
};

const data: TServer = {
  ipAddress: '121',
  name: 'server1',
  isRegistered: false,
  activeConnections: 0
};

describe('app', () => {
  beforeAll(() => {
    startServer();
  });

  afterAll(() => {
    stopServer();
  });

  test('testing register api', async () => {
    const response = await request(app).post('/server/register').send(data);
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(
      JSON.stringify({
        message: 'server successfully created and registered'
      })
    );
  });

  test('testing sample request api', async () => {
    const response = await request(app).get('/api/sample-request');
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(
      JSON.stringify({
        message: 'success'
      })
    );
  });

  test('testing unregister api', async () => {
    const response = await request(app).delete('/server/unregister?ipAddress=121');
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(
      JSON.stringify({
        message: 'server successfully unregistered'
      })
    );
  });
});
