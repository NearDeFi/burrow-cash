import BN from "bn.js";
import { getBurrow } from "../../utils";
import { expandTokenDecimal } from "../helper";
import { ChangeMethodsToken } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTransactions } from "../tokens";
import { FunctionCallOptions } from "../wallet";
import { getWithdrawTransactions } from "./withdraw";

export async function repayFromDeposits({
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
  const { logicContract } = await getBurrow();
  const tokenContract = await getTokenContract(tokenId);
  const { decimals } = (await getMetadata(tokenId))!;
  const functionCalls: FunctionCallOptions[] = [];

  const extraDecimalMultiplier = expandTokenDecimal(1, extraDecimals);
  const expandedAmount = expandTokenDecimal(amount, decimals);

  const msg = {
    Execute: {
      actions: [
        {
          Repay: {
            amount: expandedAmount.mul(extraDecimalMultiplier).toFixed(0),
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
      amount: expandedAmount.toFixed(0),
      msg: JSON.stringify(msg),
    },
  });

  const withdrawTransactions = await getWithdrawTransactions({
    tokenId,
    extraDecimals,
    amount,
    isMax,
  });

  await prepareAndExecuteTransactions([
    ...withdrawTransactions,
    {
      receiverId: tokenContract.contractId,
      functionCalls,
    },
  ]);
}
