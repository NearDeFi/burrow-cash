import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic, ChangeMethodsToken, IAssetConfig } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTokenTransactions } from "../tokens";

export async function supply(
  token_id: string,
  config: IAssetConfig,
  amount: number,
  useAsCollateral: boolean,
): Promise<void> {
  const { logicContract } = await getBurrow();
  const { decimals } = (await getMetadata(token_id))!;
  const tokenContract = await getTokenContract(token_id);

  const expandedAmount = expandToken(amount, decimals + config.extra_decimals, 0);

  const args = {
    actions: [
      {
        IncreaseCollateral: {
          token_id,
          amount: undefined as unknown as string,
        },
      },
    ],
  };

  if (amount) {
    args.actions[0].IncreaseCollateral.amount = expandedAmount;
  }

  const addCollateralTx = {
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.execute],
        args,
      },
    ],
  };

  await prepareAndExecuteTokenTransactions(
    tokenContract,
    {
      methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
      args: {
        receiver_id: logicContract.contractId,
        amount: expandedAmount,
        msg: "",
      },
    },
    useAsCollateral ? [addCollateralTx] : undefined,
  );
}
