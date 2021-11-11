import { Contract } from "near-api-js";
import { getBurrow } from "../utils";
import { getTokenContract } from "./tokens";
import { ChangeMethodsNearToken } from "../interfaces/contract-methods";

export const deposit = async (address: string, amount = "0", msg = "") => {
  const { call, account } = await getBurrow();

  try {
    const tokenContract: Contract = await getTokenContract("wrap.testnet");

    const fa = await call(
      tokenContract,
      ChangeMethodsNearToken[ChangeMethodsNearToken.near_deposit],
      {
        receiver_id: account.accountId,
        amount,
        msg,
      },
    );

    console.log("deposit", fa);
  } catch (err: any) {
    console.error(`Failed to deposit for ${account.accountId} on ${address} ${err.message}`);
  }
};

export const withdraw = async (address: string) => {
  const { call, account } = await getBurrow();

  try {
    const tokenContract: Contract = await getTokenContract("wrap.testnet");

    return await call(tokenContract, ChangeMethodsNearToken[ChangeMethodsNearToken.near_withdraw], {
      receiver_id: account.accountId,
    });
  } catch (err: any) {
    console.error(`Failed to mint for ${account.accountId} on ${address} ${err.message}`);
    return undefined;
  }
};
