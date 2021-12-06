import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsToken, IAssetConfig } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTokenTransactions } from "../tokens";

export async function repay(token_id: string, config: IAssetConfig, amount: number) {
  const { logicContract } = await getBurrow();
  const tokenContract = await getTokenContract(token_id);
  const { decimals } = (await getMetadata(token_id))!;

  const repayAmount = Number(amount) + (Number(amount) * 0.1) / 100;

  const msg = {
    Execute: {
      actions: [
        {
          Repay: {
            max_amount: expandToken(repayAmount, decimals + config.extra_decimals, 0),
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
      amount: expandToken(amount, decimals, 0),
      msg: JSON.stringify(msg),
    },
  });
}
