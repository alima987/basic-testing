// Uncomment the code below and write your tests
 import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
 import fs from 'fs';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockCallback = jest.fn();
    jest.spyOn(global, "setTimeout")
    doStuffByTimeout(mockCallback, 1000)
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(mockCallback, 1000)
  });

  test('should call callback only after timeout', () => {
   const mockCallback = jest.fn();
   jest.spyOn(global, "setTimeout")
   doStuffByTimeout(mockCallback, 1000)
   expect(mockCallback).not.toBeCalled()
   jest.advanceTimersByTime(999)
   expect(mockCallback).not.toBeCalled()
   jest.advanceTimersByTime(1)
   expect(mockCallback).toBeCalledTimes(1)
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockCallback = jest.fn();
    jest.spyOn(global, "setInterval")
    doStuffByInterval(mockCallback, 1000)
    expect(setInterval).toHaveBeenCalledTimes(1)
    expect(setInterval).toHaveBeenLastCalledWith(mockCallback, 1000)
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockCallback = jest.fn();
    jest.spyOn(global, "setInterval")
    doStuffByInterval(mockCallback, 1000)
    expect(mockCallback).not.toBeCalled()
    for (let i = 0; i < 3; i++) {
      jest.advanceTimersByTime(1000)
      expect(mockCallback).toBeCalledTimes(i + 1)
    }
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'nonexistent.txt'
    const joinSpy = jest.spyOn(require("path"), "join")
    await readFileAsynchronously(pathToFile)
    expect (joinSpy).toHaveBeenCalledWith(expect.any(String), pathToFile)
    joinSpy.mockRestore()
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'nonexistent.txt'
    const result = await readFileAsynchronously(pathToFile)
    expect(result).toBeNull()
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'existing.txt'
    const fileContent = 'Hello world!'
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    jest.spyOn(fs.promises, 'readFile').mockResolvedValueOnce(Buffer.from(fileContent))
    const result = await readFileAsynchronously(pathToFile)
    expect(result).toBe(fileContent)
  });
});
