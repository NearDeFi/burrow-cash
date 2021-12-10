import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic } from "../../interfaces";
import { getMetadata, getTokenContract, prepareAndExecuteTokenTransactions } from "../tokens";
import { ChangeMethodsNearToken } from "../../interfaces/contract-methods";
import { Transaction } from "../wallet";

export async function withdraw({
  tokenId,
  extraDecimals,
  amount,
}: {
  tokenId: string;
  extraDecimals: number;
  amount: number;
}) {
  const { logicContract } = await getBurrow();
  const tokenContract = await getTokenContract(tokenId);
  const { decimals } = (await getMetadata(tokenId))!;

  const additionalOperations: Transaction[] = [];

  const args = {
    actions: [
      {
        Withdraw: {
          token_id: tokenId,
          amount: undefined as unknown as string,
        },
      },
    ],
  };

  if (amount) {
    const expandedAmount = expandToken(amount, decimals + extraDecimals, 0);
    args.actions[0].Withdraw.amount = expandedAmount;

    if (tokenId === "wrap.testnet") {
      additionalOperations.push({
        receiverId: tokenContract.contractId,
        functionCalls: [
          {
            methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_withdraw],
            args: { amount: expandToken(amount, decimals + extraDecimals, 0) },
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
