import Decimal from "decimal.js";

import { decimalMax, getBurrow } from "../../utils";
import { expandTokenDecimal } from "../helper";
import { ChangeMethodsOracle } from "../../interfaces";
import { getMetadata, prepareAndExecuteTransactions } from "../tokens";
import { Transaction } from "../wallet";
import { transformAccount } from "../../transformers/account";
import getAccount from "../../api/get-account";

export async function repayFromDeposits({
  tokenId,
  amount,
  extraDecimals,
}: {
  tokenId: string;
  amount: number;
  extraDecimals: number;
}) {
  const { logicContract, oracleContract } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;
  const account = await getAccount().then(transformAccount);
  if (!account) return;

  const extraDecimalMultiplier = expandTokenDecimal(1, extraDecimals);
  const expandedAmount = expandTokenDecimal(amount, decimals);

  const suppliedBalance = new Decimal(account.portfolio?.supplied[tokenId]?.balance || 0);
  const decreaseCollateralAmount = decimalMax(
    expandedAmount.mul(extraDecimalMultiplier).sub(suppliedBalance),
    0,
  );

  const transactions: Transaction[] = [];

  transactions.push({
    receiverId: oracleContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
        args: {
          receiver_id: logicContract.contractId,
          msg: JSON.stringify({
            Execute: {
              actions: [
                ...(decreaseCollateralAmount.gt(0)
                  ? [
                      {
                        DecreaseCollateral: {
                          token_id: tokenId,
                          amount: decreaseCollateralAmount.toFixed(0),
                        },
                      },
                    ]
                  : []),
                {
                  Repay: {
                    token_id: tokenId,
                    amount: expandedAmount.mul(extraDecimalMultiplier).toFixed(0),
                  },
                },
              ],
            },
          }),
        },
      },
    ],
  });

  await prepareAndExecuteTransactions(transactions);
}
