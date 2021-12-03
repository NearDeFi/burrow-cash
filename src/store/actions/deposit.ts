import { Contract } from "near-api-js";
import BN from "bn.js";

import { getBurrow } from "../../utils";
import { getTokenContract, prepareAndExecuteTransactions } from "../tokens";
import { ChangeMethodsNearToken } from "../../interfaces/contract-methods";
import { ChangeMethodsLogic, ChangeMethodsToken } from "../../interfaces";
import { expandToken } from "../helper";
import { NEAR_DECIMALS } from "../constants";
import { isRegistered, Transaction } from "../wallet";

export async function deposit(amount: number, useAsCollateral: boolean) {
  const tokenId = "wrap.testnet";
  const { account, logicContract } = await getBurrow();
  const tokenContract: Contract = await getTokenContract(tokenId);
  const transactions: Transaction[] = [];

  const expandedAmount = expandToken(amount, NEAR_DECIMALS, 0);

  const collateralTemplate = {
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.execute],
        gas: new BN("100000000000000"),
        args: {
          actions: [
            {
              IncreaseCollateral: {
                token_id: tokenId,
                max_amount: expandedAmount,
              },
            },
          ],
        },
      },
    ],
  };

  transactions.push({
    receiverId: tokenContract.contractId,
    functionCalls: [
      ...(await registerNearFnCall(account.accountId, tokenContract)),
      {
        methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_deposit],
        gas: new BN("5000000000000"),
        attachedDeposit: expandedAmount,
      },
      {
        methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
        gas: new BN("100000000000000"),
        args: {
          receiver_id: logicContract.contractId,
          amount: expandedAmount,
          // msg: useAsCollateral ? JSON.stringify(collateralTemplate) : "",
          msg: "",
        },
      },
    ],
  });

  if (useAsCollateral) {
    transactions.push(collateralTemplate);
  }

  try {
    await prepareAndExecuteTransactions(transactions);
  } catch (e) {
    console.error(e);
  }
}

const registerNearFnCall = async (accountId: string, contract: Contract) =>
  !(await isRegistered(accountId, contract))
    ? [
        {
          methodName: ChangeMethodsLogic[ChangeMethodsLogic.storage_deposit],
          attachedDeposit: expandToken(0.00125, NEAR_DECIMALS),
          gas: new BN("5000000000000"),
        },
      ]
    : [];
