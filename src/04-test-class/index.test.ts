import {
  BankAccount,
  SynchronizationFailedError,
  InsufficientFundsError,
  TransferFailedError,
  getBankAccount,
} from '.';

describe('BankAccount', () => {
  let account: BankAccount;
  beforeEach(() => {
    account = new BankAccount(100);
  });
  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(150)).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const toAccount = new BankAccount(0);
    expect(() => account.transfer(150, toAccount)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(50, account)).toThrowError(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    account.withdraw(50);
    expect(account.getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    const account1 = new BankAccount(200);
    const account2 = new BankAccount(100);

    account1.transfer(50, account2);

    expect(account1.getBalance()).toBe(150);
    expect(account2.getBalance()).toBe(150);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(100);
    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
    
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(200);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(200);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
