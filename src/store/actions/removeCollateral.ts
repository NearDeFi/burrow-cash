import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsOracle } from "../../interfaces";
import { Transaction } from "../wallet";
import { getAccountDetailed } from "../accounts";
import { getMetadata, prepareAndExecuteTransactions } from "../tokens";

export async function removeCollateral({
  tokenId,
  extraDecimals,
  amount,
}: {
  tokenId: string;
  extraDecimals: number;
  amount?: number;
}) {
  const { oracleContract, account, logicContract } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;
  const accountDetailed = await getAccountDetailed(account.accountId);

  const decreaseCollateralTemplate = {
    Execute: {
      actions: [
        {
          DecreaseCollateral: {
            token_id: tokenId,
            amount: undefined as unknown as string,
          },
        },
      ],
    },
  };

  if (amount) {
    decreaseCollateralTemplate.Execute.actions[0].DecreaseCollateral.amount = expandToken(
      amount,
      decimals + extraDecimals,
      0,
    );
  }

  const asset_ids = accountDetailed
    ? [...accountDetailed.collateral, ...accountDetailed.borrowed]
        .map((c) => c.token_id)
        .filter((t, i, assetIds) => i === assetIds.indexOf(t))
        .filter((t) => t !== tokenId)
    : [];

  await prepareAndExecuteTransactions([
    {
      receiverId: oracleContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
          args: {
            receiver_id: logicContract.contractId,
            asset_ids: [...asset_ids, tokenId],
            msg: JSON.stringify(decreaseCollateralTemplate),
          },
        },
      ],
    } as Transaction,
  ]);
}
