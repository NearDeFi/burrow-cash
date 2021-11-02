import { Contract } from "near-api-js";
import { getBurrow } from "../utils";
import { getTokenContract } from "./tokens";

enum ChangeMethodsNearToken {
	near_deposit,
	near_withdraw,
}

export const deposit = async (address: string, amount = "0", msg = "") => {
	const burrow = await getBurrow();

	try {
		const tokenContract: Contract = await getTokenContract("wrap.testnet");

		const fa = await burrow.call(
			tokenContract,
			ChangeMethodsNearToken[ChangeMethodsNearToken.near_deposit],
			{
				receiver_id: burrow.account.accountId,
				amount,
				msg,
			},
		);

		console.log("deposit", fa);
	} catch (err: any) {
		console.error(`Failed to deposit for ${burrow.account.accountId} on ${address} ${err.message}`);
	}
};

export const withdraw = async (address: string) => {
	const burrow = await getBurrow();

	try {
		const tokenContract: Contract = await getTokenContract("wrap.testnet");

		const fa = await burrow.call(
			tokenContract,
			ChangeMethodsNearToken[ChangeMethodsNearToken.near_withdraw],
			{
				receiver_id: burrow.account.accountId,
			},
		);

		console.log("withdraw", fa);
	} catch (err: any) {
		console.error(`Failed to mint for ${burrow.account.accountId} on ${address} ${err.message}`);
	}
};
