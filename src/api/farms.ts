import { ChangeMethodsLogic } from "../interfaces";
import { getBurrow } from "../utils";

export const farmClaimAll = async () => {
  const { call, logicContract } = await getBurrow();
  await call(logicContract, ChangeMethodsLogic[ChangeMethodsLogic.account_farm_claim_all]);
};
