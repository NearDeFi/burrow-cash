import { Contract } from "near-api-js";
import BN from "bn.js";

import { getBurrow, nearTokenId } from "../../utils";
import { getTokenContract, prepareAndExecuteTransactions } from "../tokens";
import { ChangeMethodsNearToken } from "../../interfaces/contract-methods";
import { ChangeMethodsLogic, ChangeMethodsToken } from "../../interfaces";
import { expandToken } from "../helper";
import { NEAR_DECIMALS } from "../constants";
import { isRegistered, Transaction } from "../wallet";

export async function deposit({
  amount,
  useAsCollateral,
}: {
  amount: number;
  useAsCollateral: boolean;
}) {
  const { account, logicContract } = await getBurrow();
  const tokenContract: Contract = await getTokenContract(nearTokenId);
  const transactions: Transaction[] = [];

  const expandedAmount = expandToken(amount, NEAR_DECIMALS, 0);

  const collateralActions = {
    actions: [
      {
        IncreaseCollateral: {
          token_id: nearTokenId,
          max_amount: expandedAmount,
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
        attachedDeposit: new BN(expandedAmount),
      },
      {
        methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
        gas: new BN("150000000000000"),
        args: {
          receiver_id: logicContract.contractId,
          amount: expandedAmount,
          msg: useAsCollateral ? JSON.stringify({ Execute: collateralActions }) : "",
        },
      },
    ],
  });

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
          attachedDeposit: new BN(expandToken(0.00125, NEAR_DECIMALS)),
          gas: new BN("5000000000000"),
        },
      ]
    : [];
