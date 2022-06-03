import { Contract } from "near-api-js";
import BN from "bn.js";
import { Transaction as SelectorTransaction } from "@near-wallet-selector/core";

import { getBurrow } from "../utils";
import { ViewMethodsLogic } from "../interfaces/contract-methods";
import { Balance } from "../interfaces";

export interface Transaction {
  receiverId: string;
  functionCalls: FunctionCallOptions[];
}

export interface FunctionCallOptions {
  methodName: string;
  args?: Record<string, unknown>;
  gas?: BN;
  attachedDeposit?: BN;
}

export const executeMultipleTransactions = async (transactions) => {
  const { account, selector, fetchData, hideModal, signOut } = await getBurrow();

  const selectorTransactions: Array<SelectorTransaction> = transactions.map((t) => ({
    signerId: account.accountId,
    receiverId: t.receiverId,
    actions: t.functionCalls.map(
      ({ methodName, args = {}, gas = "50000000000000", attachedDeposit = "1" }) => ({
        type: "FunctionCall",
        params: {
          methodName,
          args,
          gas: gas.toString(),
          deposit: attachedDeposit.toString(),
        },
      }),
    ),
  }));

  try {
    const wallet = await selector.wallet();
    await wallet.signAndSendTransactions({
      transactions: selectorTransactions,
    });
  } catch (e: any) {
    if (/reject/.test(e)) {
      alert("Transaction was rejected in wallet. Please try again!");
      hideModal();
      return;
    }
    if (!/No accounts available/.test(e)) {
      throw e;
    }
    console.warn(e);
    signOut();
    alert(
      "No accounts available. Your wallet may be locked. You have been signed out. Please sign in again!",
    );
    return;
  }
  /// will refresh for injected wallets (near wallet would have redirected by now)
  await fetchData();
  hideModal();
};

export const isRegistered = async (account_id: string, contract: Contract): Promise<boolean> => {
  const { view } = await getBurrow();

  const balance = (await view(contract, ViewMethodsLogic[ViewMethodsLogic.storage_balance_of], {
    account_id,
  })) as Balance;

  return balance && balance?.total !== "0";
};
