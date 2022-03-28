import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic } from "../../interfaces";
import { Transaction } from "../wallet";
import { prepareAndExecuteTransactions } from "../tokens";

export async function stake({ amount, months }: { amount: number; months: number }) {
  const { logicContract, config } = await getBurrow();

  const transactions: Transaction[] = [];

  const duration =
    months === 12
      ? config.maximum_staking_duration_sec
      : months * config.minimum_staking_duration_sec;

  transactions.push({
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.account_stake_booster],
        args: {
          receiver_id: logicContract.contractId,
          amount: expandToken(amount, config.booster_decimals),
          duration,
        },
      },
    ],
  });

  await prepareAndExecuteTransactions(transactions);
}
