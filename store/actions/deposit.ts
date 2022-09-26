import { Contract } from "near-api-js";
import BN from "bn.js";
import Decimal from "decimal.js";

import { decimalMax, decimalMin, getBurrow, nearTokenId } from "../../utils";
import { getTokenContract, prepareAndExecuteTransactions } from "../tokens";
import { ChangeMethodsNearToken, ChangeMethodsToken } from "../../interfaces";
import { expandTokenDecimal, registerNearFnCall } from "../helper";
import { NEAR_DECIMALS, NEAR_STORAGE_DEPOSIT_DECIMAL } from "../constants";
import getBalance from "../../api/get-balance";

export async function deposit({
  amount,
  useAsCollateral,
  isMax,
}: {
  amount: number;
  useAsCollateral: boolean;
  isMax: boolean;
}) {
  const { account, logicContract } = await getBurrow();
  const tokenContract: Contract = await getTokenContract(nearTokenId);

  const accountBalance = decimalMax(
    0,
    new Decimal((await account.getAccountBalance()).available).sub(NEAR_STORAGE_DEPOSIT_DECIMAL),
  );
  const tokenBalance = new Decimal(await getBalance(nearTokenId, account.accountId));
  const maxAmount = accountBalance.add(tokenBalance);

  const expandedAmount = isMax
    ? maxAmount
    : decimalMin(expandTokenDecimal(amount, NEAR_DECIMALS), maxAmount);
  const extraDeposit = decimalMax(0, expandedAmount.sub(tokenBalance));

  const collateralActions = {
    actions: [
      {
        IncreaseCollateral: {
          token_id: nearTokenId,
          max_amount: expandedAmount.toFixed(0),
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
              amount: expandedAmount.toFixed(0),
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
