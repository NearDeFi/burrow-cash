import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsOracle } from "../../interfaces";
import { Transaction } from "../wallet";
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
  const { oracleContract, logicContract } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;

  const decreaseCollateralTemplate = {
    Execute: {
      actions: [
        {
          DecreaseCollateral: {
            token_id: tokenId,
          },
        },
      ],
    },
  };

  if (amount) {
    decreaseCollateralTemplate.Execute.actions[0].DecreaseCollateral["amount"] = expandToken(
      amount,
      decimals + extraDecimals,
      0,
    );
  }

  await prepareAndExecuteTransactions([
    {
      receiverId: oracleContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
          args: {
            receiver_id: logicContract.contractId,
            msg: JSON.stringify(decreaseCollateralTemplate),
          },
        },
      ],
    } as Transaction,
  ]);
}
