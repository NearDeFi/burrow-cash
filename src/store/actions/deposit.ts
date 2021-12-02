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

  const expandedAmount = expandToken(amount, NEAR_DECIMALS);

  transactions.push({
    receiverId: tokenContract.contractId,
    functionCalls: [
      ...(await registerNearFnCall(account.accountId, tokenContract)),
      {
        methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_deposit],
        gas: new BN(5_000_000_000),
        attachedDeposit: expandedAmount,
      },
      ...(await registerTokenFnCall(account.accountId, tokenContract)),
      {
        methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
        // gas: new BN(6_000_000_000),
        gas: new BN("100000000000000"),
        args: {
          receiver_id: logicContract.contractId,
          amount: expandedAmount,
          msg: "",
        },
      },
    ],
  });

  if (useAsCollateral) {
    transactions.push({
      receiverId: logicContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsLogic[ChangeMethodsLogic.execute],
          // gas: new BN(5_000_000_000),
          gas: new BN("100000000000000"),
          args: {
            actions: [
              {
                IncreaseCollateral: {
                  token_id: tokenId,
                  amount: expandedAmount,
                },
              },
            ],
          },
        },
      ],
    });
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
          // gas: new BN(1_250_000),
          gas: new BN("5000000000000"),
        },
      ]
    : [];

const registerTokenFnCall = async (accountId: string, contract: Contract) =>
  !(await isRegistered(accountId, contract))
    ? [
        {
          methodName: ChangeMethodsToken[ChangeMethodsToken.storage_deposit],
          attachedDeposit: expandToken(0.1, NEAR_DECIMALS),
          // gas: new BN(1_000_000_000),
          gas: new BN("5000000000000"),
        },
      ]
    : [];
