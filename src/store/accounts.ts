import {
  IAccount,
  IAccountDetailed,
  IBalance,
  ViewMethodsLogic,
  IMetadata,
  IAssetDetailed,
} from "../interfaces";
import { getBurrow } from "../utils";
import { shrinkToken } from "./helper";
import { getBalance } from "./tokens";

export const getAccounts = async (): Promise<IAccount[]> => {
  const { view, logicContract } = await getBurrow();

  const accounts: IAccount[] = (await view(
    logicContract,
    ViewMethodsLogic[ViewMethodsLogic.get_accounts_paged],
  )) as IAccount[];

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

  console.log(accountDetailed);
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
  assets: IAssetDetailed[],
): Promise<IAccountDetailed | undefined> => {
  const { account } = await getBurrow();

  const accountDetailed: IAccountDetailed | null = await getAccountDetailed(account.accountId!);

  if (accountDetailed) {
    const acc = JSON.parse(JSON.stringify(accountDetailed));

    for (const asset of [...acc.supplied, ...acc.borrowed, ...acc.collateral]) {
      const { decimals } = metadata.find((m) => m.token_id === asset.token_id)!;
      const { config } = assets.find((a) => a.token_id === asset.token_id)!;
      const d = decimals + config.extra_decimals;
      // asset.shares = shrinkToken(asset.shares, d);
      asset.balance = shrinkToken(asset.balance, d);
    }

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

export const getAccount = async () => {
  const { account } = await getBurrow();
  return account;
};
