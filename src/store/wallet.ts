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
  const { account, selector, fetchData, hideModal } = await getBurrow();

  const selectorTransactions: Array<SelectorTransaction> = transactions.map((t) => ({
    signerId: account.accountId,
    receiverId: t.receiverId,
    actions: t.functionCalls.map(
      ({ methodName, args = {}, gas = "150000000000000", attachedDeposit = "1" }) => ({
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

  const res = await selector
    .signAndSendTransactions({
      transactions: selectorTransactions,
    })
    .catch((e) => {
      if (!/reject/.test(e)) {
        throw e;
      }
      console.warn(e);
      hideModal();
    });

  /// will refresh for injected wallets (near wallet would have redirected by now)
  await fetchData();
  hideModal();

  return res;
};

export const isRegistered = async (account_id: string, contract: Contract): Promise<boolean> => {
  const { view } = await getBurrow();

  const balance = (await view(contract, ViewMethodsLogic[ViewMethodsLogic.storage_balance_of], {
    account_id,
  })) as Balance;

  return balance && balance?.total !== "0";
};
