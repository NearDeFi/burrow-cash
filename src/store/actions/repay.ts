import Decimal from "decimal.js";
import BN from "bn.js";
import { getBurrow, nearTokenId } from "../../utils";
import { expandToken, registerNearFnCall } from "../helper";
import { ChangeMethodsNearToken, ChangeMethodsToken } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTransactions } from "../tokens";
import getBalance from "../../api/get-balance";
import { FunctionCallOptions } from "../wallet";

export async function repay({
  tokenId,
  amount,
  extraDecimals,
  maxAmount,
}: {
  tokenId: string;
  amount: number;
  extraDecimals: number;
  maxAmount?: string;
}) {
  const { account, logicContract } = await getBurrow();
  const tokenContract = await getTokenContract(tokenId);
  const { decimals } = (await getMetadata(tokenId))!;
  const isNEAR = tokenId === nearTokenId;
  const functionCalls: FunctionCallOptions[] = [];

  const expandedAmount = expandToken(maxAmount || amount, decimals + extraDecimals, 0);

  if (isNEAR) {
    const tokenBalance = new Decimal(await getBalance(nearTokenId, account.accountId));
    if (new Decimal(expandedAmount).greaterThan(tokenBalance)) {
      const toWrapAmount = new Decimal(expandedAmount).sub(tokenBalance);
      functionCalls.push(...(await registerNearFnCall(account.accountId, tokenContract)));
      functionCalls.push({
        methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_deposit],
        gas: new BN("5000000000000"),
        attachedDeposit: new BN(toWrapAmount.toFixed(0)),
      });
    }
  }

  const msg = {
    Execute: {
      actions: [
        {
          Repay: {
            max_amount: expandedAmount,
            token_id: tokenId,
          },
        },
      ],
    },
  };

  functionCalls.push({
    methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
    gas: new BN("150000000000000"),
    args: {
      receiver_id: logicContract.contractId,
      amount: expandToken(maxAmount || amount, decimals, 0),
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
