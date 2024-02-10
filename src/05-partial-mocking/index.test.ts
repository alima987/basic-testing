import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => ({
  ...jest.requireActual<typeof import('./index')>('./index'),
  mockOne: jest.fn(),
  mockTwo: jest.fn(),
  mockThree: jest.fn()
}));

describe('partial mocking', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    mockOne();
    mockTwo();
    mockThree();
    expect(mockOne).not;
    expect(mockTwo).not;
    expect(mockThree).not;
  });

  test('unmockedFunction should log into console', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    unmockedFunction();
    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');
    consoleSpy.mockRestore(); 
});
});
