import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../src/errorHandler';

describe('Error handler middleware', () => {
  const error: Error = {
    name: 'error',
    message: 'error occurred'
  };
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(), // This line
      send: jest.fn() // also mocking for send function
    };
  });

  test('handle error', async () => {
    ErrorHandler(error as Error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: 'some error occurred'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
