import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsToken } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTokenTransactions } from "../tokens";

export async function repay({
  tokenId,
  amount,
  extraDecimals,
  maxAmount,
}: {
  tokenId: string;
  amount: number;
  extraDecimals: number;
  maxAmount?: number;
}) {
  const { logicContract } = await getBurrow();
  const tokenContract = await getTokenContract(tokenId);
  const { decimals } = (await getMetadata(tokenId))!;

  const msg = {
    Execute: {
      actions: [
        {
          Repay: {
            max_amount: expandToken(maxAmount || amount, decimals + extraDecimals, 0),
            token_id: tokenId,
          },
        },
      ],
    },
  };

  await prepareAndExecuteTokenTransactions(tokenContract, {
    methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
    args: {
      receiver_id: logicContract.contractId,
      amount: expandToken(maxAmount || amount, decimals, 0),
      msg: JSON.stringify(msg),
    },
  });
}
