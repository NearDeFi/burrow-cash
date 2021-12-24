import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic, ChangeMethodsOracle } from "../../interfaces";
import { getMetadata, getTokenContract, prepareAndExecuteTransactions } from "../tokens";
import { ChangeMethodsNearToken } from "../../interfaces/contract-methods";
import { getAccountDetailed } from "../accounts";
import { Transaction } from "../wallet";

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

  if (tokenId === "wrap.testnet") {
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
