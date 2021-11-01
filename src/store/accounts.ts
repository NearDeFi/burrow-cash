import { IAccount, IAccountDetailed } from "../interfaces/account";
import { getBurrow } from "../utils";
import { ChangeMethodsLogic, ViewMethodsLogic } from "../interfaces/contract-methods";
import { expandToken } from "./helper";
import { NEAR_DECIMALS } from "./constants";

export const getAccounts = async (): Promise<IAccount[]> => {
	const burrow = await getBurrow();

	const accounts: IAccount[] = (await burrow?.view(
		burrow?.logicContract,
		ViewMethodsLogic[ViewMethodsLogic.get_accounts_paged],
	)) as IAccount[];

	// base accounts
	console.log("accounts", accounts);

	return accounts;
};

export const getAccountDetailed = async (account_id: string): Promise<IAccountDetailed> => {
	const burrow = await getBurrow();

	const accountDetailed: IAccountDetailed = (await burrow?.view(
		burrow?.logicContract,
		ViewMethodsLogic[ViewMethodsLogic.get_account],
		{
			account_id,
		},
	)) as IAccountDetailed;

	// detailed accounts
	console.log("account detailed", accountDetailed);

	return accountDetailed;
};

export const isRegistered = async (account_id: string): Promise<boolean> => {
	return !!(await getAccountDetailed(account_id));
};

export const getAccountsDetailed = async (): Promise<IAccountDetailed[]> => {
	const accounts: IAccount[] = await getAccounts();

	const result: IAccountDetailed[] = await Promise.all(
		accounts.map((account) => getAccountDetailed(account.account_id)),
	);

	return result;
};

export const register = async (): Promise<void> => {
	const burrow = await getBurrow();

	console.log(`Registering ${burrow.account.accountId}`);

	await burrow.call(
		burrow.logicContract,
		ChangeMethodsLogic[ChangeMethodsLogic.storage_deposit],
		{},
		// send 0.1 near as deposit to register
		expandToken(0.1, NEAR_DECIMALS),
	);
};
