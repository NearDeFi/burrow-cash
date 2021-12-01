import { getBurrow } from "../../utils";
import { TOKEN_DECIMALS } from "../constants";
import { expandToken } from "../helper";
import { ChangeMethodsToken } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTokenTransactions } from "../tokens";

export async function repay(token_id: string, amount: number) {
  const { logicContract } = await getBurrow();
  const tokenContract = await getTokenContract(token_id);
  const { decimals } = (await getMetadata(token_id))!;

  const msg = {
    Execute: {
      actions: [
        {
          Repay: {
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
      amount: expandToken(amount, decimals || TOKEN_DECIMALS),
      msg: JSON.stringify(msg),
    },
  });
}
