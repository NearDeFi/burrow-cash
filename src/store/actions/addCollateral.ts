import { getBurrow } from "../../utils";
import { TOKEN_DECIMALS } from "../constants";
import { expandToken } from "../helper";
import { ChangeMethodsLogic } from "../../interfaces";
import { getMetadata } from "../tokens";

export async function addCollateral(token_id: string, amount?: number) {
  const { logicContract, call } = await getBurrow();
  const { decimals } = (await getMetadata(token_id))!;

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
    args.actions[0].IncreaseCollateral.amount = expandToken(amount, decimals || TOKEN_DECIMALS, 0);
  }

  await call(logicContract, ChangeMethodsLogic[ChangeMethodsLogic.execute], args);
}
