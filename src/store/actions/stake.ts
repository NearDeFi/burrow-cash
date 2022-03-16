import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic } from "../../interfaces";
import { Transaction } from "../wallet";
import { prepareAndExecuteTransactions } from "../tokens";
import { TOKEN_DECIMALS, MINIMUM_STAKING_DURATUIN, MAXIMUM_STAKING_DURATUIN } from "../constants";

export async function stake({ amount, months }: { amount: number; months: number }) {
  const { logicContract } = await getBurrow();

  const transactions: Transaction[] = [];

  const duration = months === 12 ? MAXIMUM_STAKING_DURATUIN : months * MINIMUM_STAKING_DURATUIN;

  transactions.push({
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.account_stake_booster],
        args: {
          receiver_id: logicContract.contractId,
          amount: expandToken(amount, TOKEN_DECIMALS),
          duration,
        },
      },
    ],
  });

  await prepareAndExecuteTransactions(transactions);
}
