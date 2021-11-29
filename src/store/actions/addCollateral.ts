import { getBurrow } from "../../utils";
import { DECIMAL_OVERRIDES, TOKEN_DECIMALS } from "../constants";
import { expandToken } from "../helper";
import { ChangeMethodsLogic } from "../../interfaces";
import { getMetadata } from "../tokens";

export async function addCollateral(token_id: string, amount?: number) {
  console.log(`Adding collateral ${amount} of ${token_id}`);

  const { logicContract, call } = await getBurrow();
  const metadata = await getMetadata(token_id);

  const args = {
    actions: [
      {
        IncreaseCollateral: {
          token_id,
          amount: "",
        },
      },
    ],
  };

  if (amount) {
    args.actions[0].IncreaseCollateral.amount = expandToken(
      amount,
      DECIMAL_OVERRIDES[metadata?.symbol ? metadata.symbol : ""] || TOKEN_DECIMALS,
    );
  }

  await call(logicContract, ChangeMethodsLogic[ChangeMethodsLogic.execute], args);
}
