import BN from "bn.js";

import { getBurrow, nearTokenId } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic, ChangeMethodsOracle, ChangeMethodsToken } from "../../interfaces";
import { getMetadata, getTokenContract, prepareAndExecuteTransactions } from "../tokens";
import { ChangeMethodsNearToken } from "../../interfaces/contract-methods";
import { getAccountDetailed } from "../accounts";
import { Transaction, isRegistered } from "../wallet";
import { NEAR_DECIMALS, NO_STORAGE_DEPOSIT_CONTRACTS, STORAGE_DEPOSIT_FEE } from "../constants";

export async function withdraw({
  tokenId,
  extraDecimals,
  amount,
  collateralAmount,
}: {
  tokenId: string;
  extraDecimals: number;
  amount: number;
  collateralAmount?: number;
}) {
  const { logicContract, oracleContract, account } = await getBurrow();
  const tokenContract = await getTokenContract(tokenId);
  const { decimals } = (await getMetadata(tokenId))!;
  const accountDetailed = await getAccountDetailed(account.accountId);

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

  if (collateralAmount) {
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
            msg: JSON.stringify({
              Execute: {
                actions: [
                  {
                    DecreaseCollateral: {
                      token_id: tokenId,
                      amount: expandToken(collateralAmount, decimals + extraDecimals, 0),
                    },
                  },
                ],
              },
            }),
          },
        },
      ],
    });
  }

  transactions.push({
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.execute],
        args: {
          actions: [
            {
              Withdraw: {
                token_id: tokenId,
                amount: expandToken(amount, decimals + extraDecimals, 0),
              },
            },
          ],
        },
      },
    ],
  });

  if (tokenId === nearTokenId) {
    transactions.push({
      receiverId: tokenContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_withdraw],
          args: { amount: expandToken(amount, decimals + extraDecimals, 0) },
        },
      ],
    });
  }

  await prepareAndExecuteTransactions(transactions);
}
