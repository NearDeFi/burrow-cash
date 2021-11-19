import { IAccount, IAccountDetailed, IBalance } from "../interfaces/account";
import { getBurrow } from "../utils";
import { ViewMethodsLogic } from "../interfaces/contract-methods";
import { shrinkToken } from "./helper";
import { DECIMAL_OVERRIDES, TOKEN_DECIMALS } from "./constants";
import { getBalance } from "./tokens";
import { IMetadata } from "../interfaces/asset";

export const getAccounts = async (): Promise<IAccount[]> => {
  const { view, logicContract } = await getBurrow();

  const accounts: IAccount[] = (await view(
    logicContract,
    ViewMethodsLogic[ViewMethodsLogic.get_accounts_paged],
  )) as IAccount[];

  // base accounts
  console.log("accounts", accounts);

  return accounts;
};

export const getAccountDetailed = async (account_id: string): Promise<IAccountDetailed | null> => {
  if (!account_id) return null;

  const { view, logicContract } = await getBurrow();

  const accountDetailed: IAccountDetailed = (await view(
    logicContract,
    ViewMethodsLogic[ViewMethodsLogic.get_account],
    {
      account_id,
    },
  )) as IAccountDetailed;

  // detailed accounts
  console.log("account detailed", accountDetailed);

  return accountDetailed;
};

export const getAccountsDetailed = async (): Promise<IAccountDetailed[]> => {
  const accounts: IAccount[] = await getAccounts();

  const result: IAccountDetailed[] = (
    await Promise.all(accounts.map((account) => getAccountDetailed(account.account_id)))
  ).filter((account): account is IAccountDetailed => !!account);

  return result;
};

export const getPortfolio = async (
  metadata: IMetadata[],
): Promise<IAccountDetailed | undefined> => {
  const { account } = await getBurrow();

  const accountDetailed: IAccountDetailed | null = await getAccountDetailed(account.accountId!);

  // todo: rework shrink tokens here, maybe return another object instead replacing the values

  if (accountDetailed) {
    console.log("portfolio before", accountDetailed);

    const acc = JSON.parse(JSON.stringify(accountDetailed));

    for (const asset of [...acc.supplied, ...acc.borrowed, ...acc.collateral]) {
      const { symbol } = metadata.find((m) => m.token_id === asset.token_id)!;
      const d = DECIMAL_OVERRIDES[symbol] || TOKEN_DECIMALS;
      asset.shares = shrinkToken(asset.shares, d);
      asset.balance = shrinkToken(asset.balance, d);
    }

    console.log("portfolio", acc);
    return acc;
  }
  return undefined;
};

export const getBalances = async (token_ids: string[]): Promise<IBalance[]> => {
  const { account, walletConnection } = await getBurrow();

  const balances: IBalance[] = await Promise.all(
    token_ids.map(
      async (token_id) =>
        ({
          token_id,
          account_id: account.accountId,
          balance:
            (walletConnection?.isSignedIn() && (await getBalance(token_id, account.accountId))) ||
            0,
        } as IBalance),
    ),
  );

  return balances;
};
