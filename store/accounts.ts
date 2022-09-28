import { IAccount, IAccountDetailed, ViewMethodsLogic } from "../interfaces";
import { getBurrow } from "../utils";

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

  return accountDetailed;
};

export const getAccountsDetailed = async (): Promise<IAccountDetailed[]> => {
  const accounts: IAccount[] = await getAccounts();

  const result: IAccountDetailed[] = (
    await Promise.all(accounts.map((account) => getAccountDetailed(account.account_id)))
  ).filter((account): account is IAccountDetailed => !!account);

  return result;
};

export const getAccount = async () => {
  const { account } = await getBurrow();
  return account;
};
