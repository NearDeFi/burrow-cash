import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic, ChangeMethodsToken } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTokenTransactions } from "../tokens";

export async function supply({
  tokenId,
  extraDecimals,
  useAsCollateral,
  amount,
  maxAmount,
}: {
  tokenId: string;
  extraDecimals: number;
  useAsCollateral: boolean;
  amount: number;
  maxAmount?: string;
}): Promise<void> {
  const { logicContract } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;
  const tokenContract = await getTokenContract(tokenId);

  const addCollateralTx = {
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.execute],
        args: {
          actions: [
            {
              IncreaseCollateral: {
                token_id: tokenId,
                max_amount: expandToken(maxAmount || amount, decimals + extraDecimals, 0),
              },
            },
          ],
        },
      },
    ],
  };

  await prepareAndExecuteTokenTransactions(
    tokenContract,
    {
      methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
      args: {
        receiver_id: logicContract.contractId,
        amount: expandToken(maxAmount || amount, decimals, 0),
        msg: "",
      },
    },
    useAsCollateral ? [addCollateralTx] : undefined,
  );
}
