import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic, ChangeMethodsToken } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTokenTransactions } from "../tokens";

export async function supply({
  tokenId,
  extraDecimals,
  useAsCollateral,
  amount,
}: {
  tokenId: string;
  extraDecimals: number;
  useAsCollateral: boolean;
  amount: number;
}): Promise<void> {
  const { logicContract } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;
  const tokenContract = await getTokenContract(tokenId);

  const args = {
    actions: [
      {
        IncreaseCollateral: {
          token_id: tokenId,
          max_amount: undefined as unknown as string,
        },
      },
    ],
  };

  if (amount) {
    args.actions[0].IncreaseCollateral.max_amount = expandToken(
      amount,
      decimals + extraDecimals,
      0,
    );
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
        amount: expandToken(amount, decimals, 0),
        msg: "",
      },
    },
    useAsCollateral ? [addCollateralTx] : undefined,
  );
}
