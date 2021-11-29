import { Contract } from "near-api-js";
import BN from "bn.js";
import { getBurrow } from "../../utils";
import { getTokenContract, prepareAndExecuteTransactions } from "../tokens";
import { ChangeMethodsNearToken } from "../../interfaces/contract-methods";
import { ChangeMethodsLogic } from "../../interfaces";
import { expandToken } from "../helper";
import { NEAR_DECIMALS } from "../constants";
import { isRegistered, Transaction } from "../wallet";

export async function deposit(amount) {
  const { account } = await getBurrow();

  try {
    const tokenContract: Contract = await getTokenContract("wrap.testnet");

    const transactions: Transaction[] = [];

    if (!(await isRegistered(account.accountId, tokenContract))) {
      transactions.push({
        receiverId: tokenContract.contractId,
        functionCalls: [
          {
            methodName: ChangeMethodsLogic[ChangeMethodsLogic.storage_deposit],
            attachedDeposit: new BN(expandToken(0.00125, NEAR_DECIMALS)),
          },
        ],
      });
    }

    transactions.push({
      receiverId: tokenContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_deposit],
          attachedDeposit: new BN(expandToken(amount, NEAR_DECIMALS)),
        },
      ],
    });

    await prepareAndExecuteTransactions(transactions);
  } catch (err: any) {
    console.error(`Failed to deposit for ${account.accountId}: ${err.message}`);
  }
}
