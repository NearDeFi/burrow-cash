import BN from "bn.js";

import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsOracle, ChangeMethodsToken } from "../../interfaces";
import { Transaction, isRegistered } from "../wallet";
import { getAccountDetailed } from "../accounts";
import { prepareAndExecuteTransactions, getMetadata, getTokenContract } from "../tokens";
import { NEAR_DECIMALS, NO_STORAGE_DEPOSIT_CONTRACTS, STORAGE_DEPOSIT_FEE } from "../constants";

export async function borrow({
  tokenId,
  extraDecimals,
  amount,
}: {
  tokenId: string;
  extraDecimals: number;
  amount: number;
}) {
  const { oracleContract, logicContract, account } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;
  const tokenContract = await getTokenContract(tokenId);

  const transactions: Transaction[] = [];

  if (
    !(await isRegistered(account.accountId, tokenContract)) &&
    !NO_STORAGE_DEPOSIT_CONTRACTS.includes(tokenContract.contractId)
  ) {
    transactions.push({
      receiverId: tokenContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsToken[ChangeMethodsToken.storage_deposit],
          attachedDeposit: new BN(expandToken(STORAGE_DEPOSIT_FEE, NEAR_DECIMALS)),
        },
      ],
    });
  }

  const accountDetailed = await getAccountDetailed(account.accountId);

  const borrowTemplate = {
    Execute: {
      actions: [
        {
          Borrow: {
            token_id: tokenId,
            amount: expandToken(amount, decimals + extraDecimals, 0),
          },
        },
        {
          Withdraw: {
            token_id: tokenId,
            max_amount: expandToken(amount, decimals + extraDecimals, 0),
          },
        },
      ],
    },
  };

  const asset_ids = accountDetailed
    ? [...accountDetailed.collateral, ...accountDetailed.borrowed]
        .map((c) => c.token_id)
        .filter((t, i, assetIds) => i === assetIds.indexOf(t))
        .filter((t) => t !== tokenId)
    : [];

  transactions.push({
    receiverId: oracleContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
        args: {
          receiver_id: logicContract.contractId,
          asset_ids: [...asset_ids, tokenId],
          msg: JSON.stringify(borrowTemplate),
        },
      },
    ],
  });

  await prepareAndExecuteTransactions(transactions);
}
