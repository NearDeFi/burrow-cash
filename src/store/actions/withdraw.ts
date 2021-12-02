import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic, IAssetConfig } from "../../interfaces";
import { getMetadata, getTokenContract, prepareAndExecuteTokenTransactions } from "../tokens";
import { ChangeMethodsNearToken } from "../../interfaces/contract-methods";
import { Transaction } from "../wallet";

export async function withdraw(token_id: string, config: IAssetConfig, amount?: number) {
  const { logicContract } = await getBurrow();
  const tokenContract = await getTokenContract(token_id);
  const { decimals } = (await getMetadata(token_id))!;

  const additionalOperations: Transaction[] = [];

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

  if (amount) {
    const expandedAmount = expandToken(amount, decimals + config.extra_decimals, 0);
    args.actions[0].Withdraw.amount = expandedAmount;

    if (token_id === "wrap.testnet") {
      additionalOperations.push({
        receiverId: tokenContract.contractId,
        functionCalls: [
          {
            methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_withdraw],
            args: { amount: expandToken(amount, decimals + config.extra_decimals, 0) },
          },
        ],
      });
    }
  }

  additionalOperations.push({
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.execute],
        args,
      },
    ],
  });

  await prepareAndExecuteTokenTransactions(tokenContract, undefined, additionalOperations);
}
