import Decimal from "decimal.js";
import BN from "bn.js";
import { decimalMax, decimalMin, getBurrow, nearTokenId } from "../../utils";
import { expandTokenDecimal, registerNearFnCall } from "../helper";
import { ChangeMethodsNearToken, ChangeMethodsToken } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTransactions } from "../tokens";
import getBalance from "../../api/get-balance";
import { FunctionCallOptions } from "../wallet";
import { getAccountDetailed } from "../accounts";
import { NEAR_STORAGE_DEPOSIT_DECIMAL } from "../constants";

export async function repay({
  tokenId,
  amount,
  extraDecimals,
  isMax,
}: {
  tokenId: string;
  amount: number;
  extraDecimals: number;
  isMax: boolean;
}) {
  const { account, logicContract } = await getBurrow();
  const tokenContract = await getTokenContract(tokenId);
  const { decimals } = (await getMetadata(tokenId))!;
  const detailedAccount = (await getAccountDetailed(account.accountId))!;
  const isNEAR = tokenId === nearTokenId;
  const functionCalls: FunctionCallOptions[] = [];

  const borrowedBalance = new Decimal(
    detailedAccount.borrowed.find((a) => a.token_id === tokenId)?.balance || 0,
  );

  const extraDecimalMultiplier = expandTokenDecimal(1, extraDecimals);

  const tokenBorrowedBalance = borrowedBalance.divToInt(extraDecimalMultiplier);

  const tokenBalance = new Decimal(await getBalance(tokenId, account.accountId));
  const accountBalance = decimalMax(
    0,
    new Decimal((await account.getAccountBalance()).available).sub(NEAR_STORAGE_DEPOSIT_DECIMAL),
  );

  const maxAvailableBalance = isNEAR ? tokenBalance.add(accountBalance) : tokenBalance;
  const maxAmount = decimalMin(tokenBorrowedBalance, maxAvailableBalance);

  const expandedAmountToken = isMax
    ? maxAmount
    : decimalMin(maxAmount, expandTokenDecimal(amount, decimals));

  if (isNEAR && expandedAmountToken.gt(tokenBalance)) {
    const toWrapAmount = expandedAmountToken.sub(tokenBalance);
    functionCalls.push(...(await registerNearFnCall(account.accountId, tokenContract)));
    functionCalls.push({
      methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_deposit],
      gas: new BN("10000000000000"),
      attachedDeposit: new BN(toWrapAmount.toFixed(0)),
    });
  }

  const msg = {
    Execute: {
      actions: [
        {
          Repay: {
            max_amount: !isMax
              ? expandedAmountToken.mul(extraDecimalMultiplier).toFixed(0)
              : undefined,
            token_id: tokenId,
          },
        },
      ],
    },
  };

  functionCalls.push({
    methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
    gas: new BN("100000000000000"),
    args: {
      receiver_id: logicContract.contractId,
      amount: expandedAmountToken.toFixed(0),
      msg: JSON.stringify(msg),
    },
  });

  await prepareAndExecuteTransactions([
    {
      receiverId: tokenContract.contractId,
      functionCalls,
    },
  ]);
}
