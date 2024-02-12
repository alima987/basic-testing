import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: 'mocked data' }),
  create() {
    return {
      get: this.get.mockResolvedValue({ data: 'mocked data' }),
    };
  },
}));

jest.mock('lodash', () => {
  return {
    throttle: jest.fn((fn) => fn),
  };
});

describe('throttledGetDataFromApi', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const axiosOn = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi('/test');
    expect(axiosOn).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    axiosOn.mockRestore();
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/test');
    expect(axios.create().get).toHaveBeenCalledWith('/test');
  });

  test('should return response data', async () => {
    const mockData = { id: 1, title: 'Test post' };
    (axios.create().get as jest.Mock).mockResolvedValueOnce({ data: mockData });
    const result = await throttledGetDataFromApi('/test');
    expect(result).toEqual(mockData);
  });
});
