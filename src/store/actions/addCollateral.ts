import { getBurrow } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic } from "../../interfaces";
import { getMetadata } from "../tokens";

export async function addCollateral({
  tokenId,
  extraDecimals,
  amount,
}: {
  tokenId: string;
  extraDecimals: number;
  amount?: number;
}) {
  const { logicContract, call } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;

  const args = {
    actions: [
      {
        IncreaseCollateral: {
          token_id: tokenId,
        },
      },
    ],
  };

  if (amount) {
    args.actions[0].IncreaseCollateral["amount"] = expandToken(amount, decimals + extraDecimals, 0);
  }

  await call(logicContract, ChangeMethodsLogic[ChangeMethodsLogic.execute], args);
}
