import { IAccount, IAccountDetailed } from "../interfaces/account";
import { getBurrow } from "../utils";
import { ViewMethodsLogic } from "../interfaces/contract-methods";

export const getAccounts = async (): Promise<IAccount[]> => {
	const burrow = await getBurrow();

	const accounts: IAccount[] = await burrow?.view(
		burrow?.logicContract,
		ViewMethodsLogic[ViewMethodsLogic.get_accounts_paged],
	);

	// base accounts
	console.log("accounts", accounts);

	return accounts;
};

export const getAccountsDetailed = async (): Promise<IAccountDetailed[]> => {
	const burrow = await getBurrow();

	const accounts: IAccount[] = await getAccounts();

	const result: IAccountDetailed[] = [];
	for (const account of accounts) {
		const accountDetailed: IAccountDetailed = await burrow?.view(
			burrow?.logicContract,
			ViewMethodsLogic[ViewMethodsLogic.get_account],
			{
				account_id: account.account_id,
			},
		);

		// detailed accounts
		console.log("account detailed", accountDetailed);

		result.push(accountDetailed);
	}

	return result;
};
