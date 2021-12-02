import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsOracle } from "../../interfaces";
import { Transaction } from "../wallet";
import { getAccountDetailed } from "../accounts";
import { getMetadata, prepareAndExecuteTransactions } from "../tokens";

export async function removeCollateral(token_id: string, amount?: number, config?: any) {
  const { oracleContract, account, logicContract } = await getBurrow();
  const { decimals } = (await getMetadata(token_id))!;
  const accountDetailed = await getAccountDetailed(account.accountId);

  const decreaseCollateralTemplate = {
    Execute: {
      actions: [
        {
          DecreaseCollateral: {
            token_id,
            amount: undefined as unknown as string,
          },
        },
      ],
    },
  };

  if (amount) {
    decreaseCollateralTemplate.Execute.actions[0].DecreaseCollateral.amount = expandToken(
      amount,
      decimals + config.extra_decimals,
      0,
    );
  }

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
            msg: JSON.stringify(decreaseCollateralTemplate),
          },
        },
      ],
    } as Transaction,
  ]);
}
