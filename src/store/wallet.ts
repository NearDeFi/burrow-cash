import { baseDecode } from "borsh";
import { ConnectedWalletAccount, Contract, WalletConnection } from "near-api-js";
import { Action, createTransaction, functionCall } from "near-api-js/lib/transaction";
import { PublicKey } from "near-api-js/lib/utils";
import BN from "bn.js";

import { getBurrow } from "../utils";
import { ViewMethodsLogic } from "../interfaces/contract-methods";
import { Balance } from "../interfaces";

export interface FunctionCallOptions {
  methodName: string;
  args?: Record<string, unknown>;
  gas?: BN;
  attachedDeposit?: BN;
}

export interface Transaction {
  receiverId: string;
  functionCalls: FunctionCallOptions[];
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
    const accessKey = await this.accessKeyForTransaction(receiverId, actions, localKey);
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

export class BatchWallet extends WalletConnection {
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
    return this._connectedAccount.createTransaction({
      receiverId,
      actions,
      nonceOffset,
    });
  }
}

export const executeMultipleTransactions = async (
  transactions: Transaction[],
  callbackUrl?: string,
) => {
  const { walletConnection } = await getBurrow();

  const gas = new BN(150000000000000);
  const attachedDeposit = new BN(1);

  const nearTransactions = await Promise.all(
    transactions.map((t, i) => {
      // @ts-ignore
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

  return walletConnection.requestSignTransactions({
    transactions: nearTransactions,
    callbackUrl,
  })!;
};

export const isRegistered = async (account_id: string, contract: Contract): Promise<boolean> => {
  const { view } = await getBurrow();

  const balance = (await view(contract, ViewMethodsLogic[ViewMethodsLogic.storage_balance_of], {
    account_id,
  })) as Balance;

  console.log("balance", balance);

  return balance?.total !== "0";
};
