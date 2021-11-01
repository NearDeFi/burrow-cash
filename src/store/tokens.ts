import { Contract } from "near-api-js";
import { getBurrow } from "../utils";
import { IAssetDetailed, IMetadata } from "../interfaces/asset";
import Decimal from "decimal.js";
import { DEFAULT_PRECISION, NEAR_DECIMALS } from "./constants";
import { expandToken, getContract, shrinkToken } from "./helper";
import { ChangeMethodsLogic, ChangeMethodsOracle } from "../interfaces/contract-methods";

Decimal.set({ precision: DEFAULT_PRECISION });

enum ViewMethodsToken {
	ft_metadata,
	ft_balance_of,
}

enum ChangeMethodsToken {
	ft_transfer_call,
}

export const getTokenContract = async (tokenContractAddress: string): Promise<Contract> => {
	const { account } = await getBurrow();
	return await getContract(account, tokenContractAddress, ViewMethodsToken, ChangeMethodsToken);
};

export const getBalance = async (
	token_id: string,
	accountId: string,
): Promise<number | undefined> => {
	const { view } = await getBurrow();

	try {
		const tokenContract: Contract = await getTokenContract(token_id);

		const balanceInYocto: string = (await view(
			tokenContract,
			ViewMethodsToken[ViewMethodsToken.ft_balance_of],
			{
				account_id: accountId,
			},
		)) as string;

		const metadata = await getMetadata(token_id);
		const balance = shrinkToken(balanceInYocto, metadata?.decimals!);

		return Number(balance);
	} catch (err: any) {
		console.error(`Failed to get balance for ${accountId} on ${token_id} ${err.message}`);
	}
};

export const getMetadata = async (token_id: string): Promise<IMetadata | undefined> => {
	try {
		const { view } = await getBurrow();
		const tokenContract: Contract = await getTokenContract(token_id);

		const metadata: IMetadata = (await view(
			tokenContract,
			ViewMethodsToken[ViewMethodsToken.ft_metadata],
		)) as IMetadata;

		metadata.token_id = token_id;

		console.log("metadata", metadata);
		return metadata;
	} catch (err: any) {
		console.error(`Failed to get metadata for ${token_id} ${err.message}`);
	}
};

export const getAllMetadata = async (token_ids: string[]): Promise<IMetadata[]> => {
	const metadata: IMetadata[] = (
		await Promise.all(token_ids.map((token_id) => getMetadata(token_id)))
	).filter((m): m is IMetadata => !!m);

	return metadata;
};

export const supply = async (token_id: string, amount: number): Promise<void> => {
	console.log(`Supplying ${amount} to ${token_id}`);

	const { call, logicContract } = await getBurrow();

	const tokenContract = await getTokenContract(token_id);
	const metadata = await getMetadata(token_id);
	const expandedAmount = expandToken(amount, metadata?.decimals! || NEAR_DECIMALS);

	console.log("transaction fixed amount", expandedAmount);

	await call(tokenContract, ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call], {
		receiver_id: logicContract.contractId,
		amount: expandedAmount,
		msg: "",
	});
};

export const borrow = async (token_id: string, amount: number) => {
	console.log(`Borrowing ${amount} of ${token_id}`);

	const { call, oracleContract, logicContract } = await getBurrow();
	const metadata = await getMetadata(token_id);
	const expandedAmount = expandToken(amount, metadata?.decimals || NEAR_DECIMALS);

	const borrowTemplate = {
		Execute: {
			actions: [
				{
					Borrow: {
						token_id,
						amount: expandedAmount,
					},
				},
			],
		},
	};

	await call(oracleContract, ChangeMethodsOracle[ChangeMethodsOracle.oracle_call], {
		receiver_id: logicContract.contractId,
		asset_ids: ["usdt.fakes.testnet", token_id],
		msg: JSON.stringify(borrowTemplate),
	});
};

export const addCollateral = async (token_id: string, amount?: number) => {
	console.log(`Adding collateral ${amount} of ${token_id}`);

	const { logicContract, call } = await getBurrow();
	const metadata = await getMetadata(token_id);

	const args = {
		actions: [
			{
				IncreaseCollateral: {
					token_id,
				},
			},
		],
	};

	if (amount) {
		args.actions[0].IncreaseCollateral["amount"] = expandToken(
			amount,
			metadata?.decimals || NEAR_DECIMALS,
		);
	}

	await call(logicContract, ChangeMethodsLogic[ChangeMethodsLogic.execute], args);
};

export const withdraw = async (token_id: string, amount?: number) => {
	console.log(`Withdrawing ${amount} of ${token_id}`);

	const { call, logicContract } = await getBurrow();
	const metadata = await getMetadata(token_id);

	const args = {
		actions: [
			{
				Withdraw: {
					token_id,
				},
			},
		],
	};

	if (amount) {
		args.actions[0].Withdraw["amount"] = expandToken(amount, metadata?.decimals || NEAR_DECIMALS);
	}

	await call(logicContract, ChangeMethodsLogic[ChangeMethodsLogic.execute], args);
};

export const repay = async (token_id: string, amount: number) => {
	console.log(`Repaying ${amount} of ${token_id}`);

	const { logicContract, call } = await getBurrow();
	const tokenContract = await getTokenContract(token_id);
	const metadata = await getMetadata(token_id);

	const msg = {
		Execute: {
			actions: [
				{
					Repay: {
						token_id,
					},
				},
			],
		},
	};

	const args = {
		receiver_id: logicContract.contractId,
		amount: expandToken(amount, metadata?.decimals || NEAR_DECIMALS),
		msg: JSON.stringify(msg),
	};

	await call(tokenContract, ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call], args);
};
