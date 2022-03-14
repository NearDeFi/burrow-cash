import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic } from "../../interfaces";
import { Transaction } from "../wallet";
import { prepareAndExecuteTransactions } from "../tokens";
import { TOKEN_DECIMALS } from "../constants";

const SECONDS_IN_MONTH = 24 * 3600 * 31;
const SECONDS_IN_YEAR = 24 * 3600 * 365;

export async function stake({ amount, months }: { amount: number; months: number }) {
  const { logicContract } = await getBurrow();

  const transactions: Transaction[] = [];

  const duration = months === 12 ? SECONDS_IN_YEAR : months * SECONDS_IN_MONTH;

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
