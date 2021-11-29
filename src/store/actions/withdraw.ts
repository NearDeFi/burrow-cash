import { getBurrow } from "../../utils";
import { DECIMAL_OVERRIDES, TOKEN_DECIMALS } from "../constants";
import { expandToken } from "../helper";
import { ChangeMethodsLogic } from "../../interfaces";
import { getMetadata, getTokenContract, prepareAndExecuteTokenTransactions } from "../tokens";

export async function withdraw(token_id: string, amount?: number) {
  console.log(`Withdrawing ${amount} of ${token_id}`);

  const { logicContract } = await getBurrow();
  const metadata = await getMetadata(token_id);
  const tokenContract = await getTokenContract(token_id);

  const args = {
    actions: [
      {
        Withdraw: {
          token_id,
          amount: undefined as unknown as string,
        },
      },
    ],
  };

  const deciamls = DECIMAL_OVERRIDES[token_id] || TOKEN_DECIMALS;

  if (amount) {
    const expandedAmount = expandToken(amount, deciamls);
    args.actions[0].Withdraw.amount = expandedAmount;
    console.log("withdraw", metadata?.decimals, token_id, amount, expandedAmount);
  }

  const withdrawTemplate = {
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.execute],
        args,
      },
    ],
  };

  await prepareAndExecuteTokenTransactions(tokenContract, undefined, [withdrawTemplate]);
}
