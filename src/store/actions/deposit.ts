import { Contract } from "near-api-js";
import BN from "bn.js";
import Decimal from "decimal.js";

import { getBurrow, nearTokenId } from "../../utils";
import { getTokenContract, prepareAndExecuteTransactions } from "../tokens";
import { ChangeMethodsNearToken } from "../../interfaces/contract-methods";
import { ChangeMethodsToken } from "../../interfaces";
import { expandToken, registerNearFnCall } from "../helper";
import { NEAR_DECIMALS } from "../constants";
import getBalance from "../../api/get-balance";

export async function deposit({
  amount,
  useAsCollateral,
}: {
  amount: number;
  useAsCollateral: boolean;
}) {
  const { account, logicContract } = await getBurrow();
  const tokenContract: Contract = await getTokenContract(nearTokenId);

  const expandedAmount = expandToken(amount, NEAR_DECIMALS, 0);
  const tokenBalance = new Decimal(await getBalance(nearTokenId, account.accountId));
  const extraDeposit = new Decimal(expandedAmount).greaterThan(tokenBalance)
    ? new Decimal(expandedAmount).sub(tokenBalance)
    : new Decimal(0);

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

  try {
    await prepareAndExecuteTransactions([
      {
        receiverId: tokenContract.contractId,
        functionCalls: [
          ...(await registerNearFnCall(account.accountId, tokenContract)),
          ...(extraDeposit.greaterThan(0)
            ? [
                {
                  methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_deposit],
                  gas: new BN("5000000000000"),
                  attachedDeposit: new BN(extraDeposit.toFixed(0)),
                },
              ]
            : []),
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
      },
    ]);
  } catch (e) {
    console.error(e);
  }
}
