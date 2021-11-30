import { getBurrow } from "../../utils";
import { DECIMAL_OVERRIDES, TOKEN_DECIMALS } from "../constants";
import { expandToken } from "../helper";
import { ChangeMethodsOracle } from "../../interfaces";
import { Transaction } from "../wallet";
import { getAccountDetailed } from "../accounts";
import { prepareAndExecuteTransactions } from "../tokens";

export async function borrow(token_id: string, amount: number) {
  console.log(`Borrowing ${amount} of ${token_id}`);

  const { oracleContract, logicContract, account } = await getBurrow();

  const accountDetailed = await getAccountDetailed(account.accountId);

  const deciamls = DECIMAL_OVERRIDES[token_id] || TOKEN_DECIMALS;

  const borrowTemplate = {
    Execute: {
      actions: [
        {
          Borrow: {
            token_id,
            amount: expandToken(amount, deciamls),
          },
        },
        {
          Withdraw: {
            token_id,
            max_amount: expandToken(amount, TOKEN_DECIMALS),
          },
        },
      ],
    },
  };

  const asset_ids = accountDetailed
    ? [...accountDetailed.collateral, ...accountDetailed.borrowed]
        .map((c) => c.token_id)
        .filter((t, i, assetIds) => i === assetIds.indexOf(t))
        .filter((t) => t !== token_id)
    : [];

  await prepareAndExecuteTransactions([
    {
      receiverId: oracleContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
          args: {
            receiver_id: logicContract.contractId,
            asset_ids: [...asset_ids, token_id],
            msg: JSON.stringify(borrowTemplate),
          },
        },
      ],
    } as Transaction,
  ]);
}
