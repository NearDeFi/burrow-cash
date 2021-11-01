import { IAccount, IAccountDetailed, IBalance } from "../interfaces/account";
import { getBurrow } from "../utils";
import { ChangeMethodsLogic, ViewMethodsLogic } from "../interfaces/contract-methods";
import { expandToken, shrinkToken } from "./helper";
import { DECIMAL_OVERRIDES, NEAR_DECIMALS, TOKEN_DECIMALS } from "./constants";
import { getBalance } from "./tokens";
import { IMetadata } from "../interfaces/asset";

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

export const getPortfolio = async (metadata: IMetadata[]): Promise<IAccountDetailed> => {
	const burrow = await getBurrow();

	const account: IAccountDetailed = await getAccountDetailed(burrow?.account.accountId!);

	for (const asset of [...account.borrowed, ...account.supplied, ...account.collateral]) {
		const { symbol } = await metadata.find((m) => m.token_id === asset.token_id)!;

		const decimals = DECIMAL_OVERRIDES[symbol] || TOKEN_DECIMALS;
		asset.shares = shrinkToken(asset.shares, decimals);
		asset.balance = shrinkToken(asset.balance, decimals);
	}

	return account;
};

export const getBalances = async (token_ids: string[]): Promise<IBalance[]> => {
	const burrow = await getBurrow();

	const balances: IBalance[] = await Promise.all(
		token_ids.map(
			async (token_id) =>
				({
					token_id: token_id,
					account_id: burrow?.account.accountId,
					balance:
						(burrow?.walletConnection.isSignedIn() &&
							(await getBalance(token_id, burrow.account.accountId))) ||
						0,
				} as IBalance),
		),
	);

	return balances;
};
