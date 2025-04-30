// Uncomment the code below and write your tests
 import { getBankAccount, InsufficientFundsError, SynchronizationFailedError, TransferFailedError } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(1000)
    expect(account.getBalance()).toBe(1000)
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(1000)
    expect(() => account.withdraw(1500)).toThrow(InsufficientFundsError)
  });

  test('should throw error when transferring more than balance', () => {
    const account = getBankAccount(1000)
    expect(() => account.transfer(1500, account)).toThrow(TransferFailedError)
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(1000)
    expect(() => account.transfer(100, account)).toThrow(TransferFailedError)
  });

  test('should deposit money', () => {
    const account = getBankAccount(500)
    account.deposit(1000)
    expect(account.getBalance()).toBe(1500)
  });

  test('should withdraw money', () => {
    const account = getBankAccount(1000)
    account.withdraw(500)
    expect(account.getBalance()).toBe(500)
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(1000);
    const account2 = getBankAccount(200);
    account1.transfer(500, account2)
    expect(account1.getBalance()).toBe(500);
    expect(account2.getBalance()).toBe(700);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(1000)
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(100)
    const balance = await account.fetchBalance()
    expect(balance).toBe(100)
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(1000)
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(100)
    await account.synchronizeBalance()
    expect(account.getBalance()).toBe(100)
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(1000)
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null)
    await expect(account.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError)
  });
});
