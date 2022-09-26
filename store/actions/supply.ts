import Decimal from "decimal.js";

import { decimalMin, getBurrow } from "../../utils";
import { expandTokenDecimal } from "../helper";
import { ChangeMethodsToken } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTokenTransactions } from "../tokens";
import getBalance from "../../api/get-balance";

export async function supply({
  tokenId,
  extraDecimals,
  useAsCollateral,
  amount,
  isMax,
}: {
  tokenId: string;
  extraDecimals: number;
  useAsCollateral: boolean;
  amount: number;
  isMax: boolean;
}): Promise<void> {
  const { account, logicContract } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;
  const tokenContract = await getTokenContract(tokenId);

  const tokenBalance = new Decimal(await getBalance(tokenId, account.accountId));

  const expandedAmount = isMax
    ? tokenBalance
    : decimalMin(expandTokenDecimal(amount, decimals), tokenBalance);

  const collateralAmount = expandTokenDecimal(expandedAmount, extraDecimals);

  const collateralActions = {
    actions: [
      {
        IncreaseCollateral: {
          token_id: tokenId,
          max_amount: collateralAmount.toFixed(0),
        },
      },
    ],
  };

  await prepareAndExecuteTokenTransactions(tokenContract, {
    methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
    args: {
      receiver_id: logicContract.contractId,
      amount: expandedAmount.toFixed(0),
      msg: useAsCollateral ? JSON.stringify({ Execute: collateralActions }) : "",
    },
  });
}
