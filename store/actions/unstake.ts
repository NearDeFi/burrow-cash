import { getBurrow } from "../../utils";
import { ChangeMethodsLogic } from "../../interfaces";
import { Transaction } from "../wallet";
import { prepareAndExecuteTransactions } from "../tokens";

export async function unstake() {
  const { logicContract } = await getBurrow();

  const transactions: Transaction[] = [];

  transactions.push({
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.account_unstake_booster],
        args: {
          receiver_id: logicContract.contractId,
        },
      },
    ],
  });

  await prepareAndExecuteTransactions(transactions);
}
