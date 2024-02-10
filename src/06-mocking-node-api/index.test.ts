import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fs from 'fs';

describe('doStuffByTimeout', () => {
  jest.useFakeTimers();

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, timeout);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    doStuffByTimeout(callback, timeout);
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(999);
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  jest.useFakeTimers();

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, interval);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;
    const numIntervals = 3;
    doStuffByInterval(callback, interval);
    expect(callback).not.toBeCalled();
    for (let i = 0; i < numIntervals; i++) {
      jest.advanceTimersByTime(interval);
      expect(callback).toBeCalledTimes(i + 1);
    }
  });

  describe('readFileAsynchronously', () => {
    test('should call join with pathToFile', async () => {
      const pathToFile = 'test.txt';
      const joinSpy = jest.spyOn(require('path'), 'join');
      await readFileAsynchronously(pathToFile);
      expect(joinSpy).toHaveBeenCalledWith(expect.any(String), pathToFile);
      joinSpy.mockRestore();
    });
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'nonexistent.txt';
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'existing.txt';
    const fileContent = 'Hello, World!';
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValueOnce(Buffer.from(fileContent));
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe(fileContent);
  });
});
