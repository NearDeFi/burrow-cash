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

export const getAccountDetailed = async (account_id: string): Promise<IAccountDetailed> => {
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

	const result: IAccountDetailed[] = await Promise.all(
		accounts.map((account) => getAccountDetailed(account.account_id)),
	);

	return result;
};

export const getPortfolio = async (
	metadata: IMetadata[],
): Promise<IAccountDetailed | undefined> => {
	const { account } = await getBurrow();

	const accountDetailed: IAccountDetailed = await getAccountDetailed(account.accountId!);

	if (accountDetailed) {
		for (const asset of [
			...accountDetailed.borrowed,
			...accountDetailed.supplied,
			...accountDetailed.collateral,
		]) {
			const { symbol } = metadata.find((m) => m.token_id === asset.token_id)!;

			const decimals = DECIMAL_OVERRIDES[symbol] || TOKEN_DECIMALS;
			asset.shares = shrinkToken(asset.shares, decimals);
			asset.balance = shrinkToken(asset.balance, decimals);
		}

		return accountDetailed;
	}
};

export const getBalances = async (token_ids: string[]): Promise<IBalance[]> => {
	const { account, walletConnection } = await getBurrow();

	const balances: IBalance[] = await Promise.all(
		token_ids.map(
			async (token_id) =>
				({
					token_id: token_id,
					account_id: account.accountId,
					balance:
						(walletConnection.isSignedIn() && (await getBalance(token_id, account.accountId))) || 0,
				} as IBalance),
		),
	);

	return balances;
};
