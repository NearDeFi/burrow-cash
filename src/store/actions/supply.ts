import { getBurrow } from "../../utils";
import { NEAR_DECIMALS } from "../constants";
import { expandToken } from "../helper";
import { ChangeMethodsLogic, ChangeMethodsToken } from "../../interfaces";
import { getTokenContract, getMetadata, prepareAndExecuteTokenTransactions } from "../tokens";

export async function supply(
  token_id: string,
  amount: number,
  useAsCollateral: boolean,
): Promise<void> {
  console.log(`Supplying ${amount} to ${token_id}`);

  const { logicContract } = await getBurrow();

  const tokenContract = await getTokenContract(token_id);
  const metadata = await getMetadata(token_id);
  const expandedAmount = expandToken(amount, metadata?.decimals! || NEAR_DECIMALS);

  console.log("transaction fixed amount", expandedAmount);

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
    args.actions[0].IncreaseCollateral.amount = expandToken(
      amount,
      metadata?.decimals || NEAR_DECIMALS,
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
        amount: expandedAmount,
        msg: "",
      },
    },
    useAsCollateral ? [addCollateralTx] : undefined,
  );
}
