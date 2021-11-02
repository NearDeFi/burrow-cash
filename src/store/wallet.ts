import { functionCall } from "near-api-js/lib/transaction";
import { getBurrow } from "../utils";
import { baseDecode } from "borsh";
import { ConnectedWalletAccount, Contract, WalletConnection } from "near-api-js";
import { Action, createTransaction } from "near-api-js/lib/transaction";
import { PublicKey } from "near-api-js/lib/utils";
import BN from "bn.js";
import { ViewMethodsLogic } from "../interfaces/contract-methods";

export interface FunctionCallOptions {
	methodName: string;
	args?: object;
	gas?: BN;
	attachedDeposit?: BN;
}

export interface Transaction {
	receiverId: string;
	functionCalls: FunctionCallOptions[];
}

export default class BatchWallet extends WalletConnection {
	override _connectedAccount!: BatchWalletAccount;

	account() {
		if (!this._connectedAccount) {
			this._connectedAccount = new BatchWalletAccount(
				this,
				this._near.connection,
				this._authData.accountId,
			);
		}

		return this._connectedAccount;
	}

	createTransaction({
		receiverId,
		actions,
		nonceOffset = 1,
	}: {
		receiverId: string;
		actions: Action[];
		nonceOffset?: number;
	}) {
		return this._connectedAccount?.createTransaction({
			receiverId,
			actions,
			nonceOffset,
		});
	}
}

export class BatchWalletAccount extends ConnectedWalletAccount {
	async sendTransactionWithActions(receiverId: string, actions: Action[]) {
		return this.signAndSendTransaction(receiverId, actions);
	}

	async createTransaction({
		receiverId,
		actions,
		nonceOffset = 1,
	}: {
		receiverId: string;
		actions: Action[];
		nonceOffset?: number;
	}) {
		const localKey = await this.connection.signer.getPublicKey(
			this.accountId,
			this.connection.networkId,
		);
		let accessKey = await this.accessKeyForTransaction(receiverId, actions, localKey);
		if (!accessKey) {
			throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`);
		}

		const block = await this.connection.provider.block({ finality: "final" });
		const blockHash = baseDecode(block.header.hash);

		const publicKey = PublicKey.from(accessKey.public_key);
		const nonce = accessKey.access_key.nonce + nonceOffset;

		return createTransaction(this.accountId, publicKey, receiverId, nonce, actions, blockHash);
	}
}

const gas = new BN(150000000000000); //new BN(7 * 10 ** 12);
const attachedDeposit = new BN(1);

export const executeMultipleTransactions = async (
	transactions: Transaction[],
	callbackUrl?: string,
) => {
	const { walletConnection } = await getBurrow();

	const nearTransactions = await Promise.all(
		transactions.map((t, i) => {
			return walletConnection.createTransaction({
				receiverId: t.receiverId,
				nonceOffset: i + 1,
				actions: t.functionCalls.map((fc) =>
					functionCall(
						fc.methodName,
						fc.args || {},
						fc.gas || gas,
						fc.attachedDeposit || attachedDeposit,
					),
				),
			});
		}),
	);

	return await walletConnection.requestSignTransactions({
		transactions: nearTransactions,
		callbackUrl: callbackUrl,
	})!;
};

export const isRegistered = async (account_id: string, contract?: Contract): Promise<boolean> => {
	const { view, logicContract } = await getBurrow();

	return !!(await view(
		contract || logicContract,
		ViewMethodsLogic[ViewMethodsLogic.storage_balance_of],
		{
			account_id,
		},
	));
};
