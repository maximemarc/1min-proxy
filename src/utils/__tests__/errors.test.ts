import { describe, it, expect } from 'vitest';
import {
  APIError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  NotImplementedError,
} from '../errors.js';

describe('APIError', () => {
  it('should create an APIError with default values', () => {
    const error = new APIError('Something went wrong');

    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe('APIError');
  });

  it('should create an APIError with custom status code', () => {
    const error = new APIError('Not found', 404, 'not_found');

    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('not_found');
  });

  it('should serialize to JSON correctly', () => {
    const error = new APIError('Test error', 400, 'test_error', { field: 'value' });

    expect(error.toJSON()).toEqual({
      error: {
        message: 'Test error',
        type: 'test_error',
        details: { field: 'value' },
      },
    });
  });
});

describe('ValidationError', () => {
  it('should create a ValidationError', () => {
    const error = new ValidationError('Invalid input');

    expect(error.message).toBe('Invalid input');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('invalid_request_error');
  });
});

describe('AuthenticationError', () => {
  it('should create an AuthenticationError with default message', () => {
    const error = new AuthenticationError();

    expect(error.message).toBe('Missing or invalid API key');
    expect(error.statusCode).toBe(401);
  });

  it('should create an AuthenticationError with custom message', () => {
    const error = new AuthenticationError('Custom auth error');

    expect(error.message).toBe('Custom auth error');
  });
});

describe('NotFoundError', () => {
  it('should create a NotFoundError', () => {
    const error = new NotFoundError('User');

    expect(error.message).toBe('User not found');
    expect(error.statusCode).toBe(404);
  });
});

describe('RateLimitError', () => {
  it('should create a RateLimitError', () => {
    const error = new RateLimitError();

    expect(error.message).toBe('Rate limit exceeded');
    expect(error.statusCode).toBe(429);
  });
});

describe('NotImplementedError', () => {
  it('should create a NotImplementedError', () => {
    const error = new NotImplementedError('Feature X');

    expect(error.message).toBe('Feature X is not implemented');
    expect(error.statusCode).toBe(501);
  });
});
