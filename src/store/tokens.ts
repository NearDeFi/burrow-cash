import { Contract } from "near-api-js";
import { getBurrow } from "../utils";
import { IAssetDetailed, IMetadata } from "../interfaces/asset";
import Decimal from "decimal.js";
import { DEFAULT_PRECISION } from "./constants";
import { expandToken, shrinkToken } from "./helper";

Decimal.set({ precision: DEFAULT_PRECISION });

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
	asset: IAssetDetailed,
	accountId: string,
): Promise<number | undefined> => {
	const burrow = await getBurrow();

	try {
		const tokenContract: Contract = await getTokenContract(asset.token_id);

		const balanceInYocto: string = (await burrow.view(
			tokenContract,
			ViewMethodsToken[ViewMethodsToken.ft_balance_of],
			{
				account_id: accountId,
			},
		)) as string;

		const balance = shrinkToken(balanceInYocto, asset.metadata?.decimals!);

		// console.log("balance", accountId, asset.token_id, balance.toNumber());

		return Number(balance);
	} catch (err: any) {
		console.error(`Failed to get balance for ${accountId} on ${asset.token_id} ${err.message}`);
	}
};

export const getMetadata = async (address: string): Promise<IMetadata | undefined> => {
	const burrow = await getBurrow();

	try {
		const tokenContract: Contract = await getTokenContract(address);

		const metadata: IMetadata = (await burrow.view(
			tokenContract,
			ViewMethodsToken[ViewMethodsToken.ft_metadata],
		)) as IMetadata;

		console.log("metadata", metadata);
		return metadata;
	} catch (err: any) {
		console.error(`Failed to get metadata for ${address} ${err.message}`);
	}
};

export const supply = async (name: string, amount: number): Promise<void> => {
	console.log(`Supplying ${amount} to ${name}`);

	const burrow = await getBurrow();

	const tokenContract = await getTokenContract(name);
	const metadata = await getMetadata(name);
	const fixedAmount = expandToken(amount, metadata?.decimals!);

	console.log("transaction fixed amount", fixedAmount);

	await burrow.call(tokenContract, ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call], {
		receiver_id: burrow.logicContract.contractId,
		amount: fixedAmount,
		msg: "",
	});
};

export const borrow = async (name: string, amount: number) => {
	console.log(`Borrowing ${amount} of ${name}`);
};
