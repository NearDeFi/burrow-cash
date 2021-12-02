import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsToken } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTokenTransactions } from "../tokens";

export async function repay(token_id: string, amount: number, config) {
  const { logicContract } = await getBurrow();
  const tokenContract = await getTokenContract(token_id);
  const { decimals } = (await getMetadata(token_id))!;

  const msg = {
    Execute: {
      actions: [
        {
          Repay: {
            max_amount: expandToken(amount, decimals + config.extra_decimals),
            token_id,
          },
        },
      ],
    },
  };

  await prepareAndExecuteTokenTransactions(tokenContract, {
    methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
    args: {
      receiver_id: logicContract.contractId,
      amount: expandToken(amount, decimals + config.extra_decimals),
      msg: JSON.stringify(msg),
    },
  });
}
