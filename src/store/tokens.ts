import { Contract } from "near-api-js";
import { getBurrow } from "../utils";
import { deposit } from "./wnear-token";

enum ViewMethodsToken {
	ft_metadata,
	ft_balance_of,
}

enum ChangeMethodsToken {
	ft_transfer_call,
}

export const getTokenContract = async (tokenContractAddress: string): Promise<Contract> => {
	const burrow = await getBurrow();

	const tokenContract: Contract = new Contract(burrow.account, tokenContractAddress, {
		// View methods are read only. They don't modify the state, but usually return some value.
		viewMethods: Object.values(ViewMethodsToken)
			// @ts-ignore
			.filter((m) => typeof m === "string")
			.map((m) => m as string),
		// Change methods can modify the state. But you don't receive the returned value when called.
		changeMethods: Object.values(ChangeMethodsToken)
			// @ts-ignore
			.filter((m) => typeof m === "string")
			.map((m) => m as string),
	});

	return tokenContract;
};

export const getBalance = async (
	tokenContractAddress: string,
	accountId: string,
): Promise<string | undefined> => {
	const burrow = await getBurrow();

	try {
		const tokenContract: Contract = await getTokenContract(tokenContractAddress);

		const balance: string = await burrow.view(
			tokenContract,
			ViewMethodsToken[ViewMethodsToken.ft_balance_of],
			{
				account_id: accountId,
			},
		);

		console.log("balance", tokenContractAddress, balance, accountId);
		return balance;
	} catch (err: any) {
		console.error(
			`Failed to get balance for ${accountId} on ${tokenContractAddress} ${err.message}`,
		);
	}
};

export const getMetadata = async (address: string): Promise<any> => {
	const burrow = await getBurrow();

	try {
		const tokenContract: Contract = await getTokenContract(address);

		const metadata = await burrow.view(
			tokenContract,
			ViewMethodsToken[ViewMethodsToken.ft_metadata],
		);

		return metadata;
	} catch (err: any) {
		console.error(`Failed to get metadata for ${address} ${err.message}`);
	}
};
