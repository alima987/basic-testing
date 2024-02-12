import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Subtract, expected: 0 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 6, b: 2, action: Action.Divide, expected: 3 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'calculates %p %p %p = %p',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
  test('returns null for invalid input', () => {
    expect(simpleCalculator({ a: 'foo', b: 'bar', action: '+' })).toBe(null);
  });

  test('throws an error for unknown action', () => {
    const result = simpleCalculator({ a: 'invalid', b: 3, action: Action.Add });
    expect(result).toBeNull;
  });
});
