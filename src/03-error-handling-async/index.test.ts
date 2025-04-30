// Uncomment the code below and write your tests
import { throwError, throwCustomError, resolveValue, MyAwesomeError, rejectCustomError } from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const input = 16
    const result = await resolveValue(input)
    expect(result).toBe(input)
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const message = "Hello world!";
    expect(() => throwError(message)).toThrow("Hello world!");
  });

  test('should throw error with default message if message is not provided', () => {
      expect(() => throwError()).toThrow('Oops!')
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError)
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    expect(() => rejectCustomError()).rejects.toThrow(MyAwesomeError)
  });
});
