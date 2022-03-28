import { Contract } from "near-api-js";

import { getBurrow } from "../utils";
import { getContract } from "../store";
import { ChangeMethodsToken, ViewMethodsToken } from "../interfaces";

export const getTokenContract = async (tokenContractAddress: string): Promise<Contract> => {
  const { account } = await getBurrow();
  return getContract(account, tokenContractAddress, ViewMethodsToken, ChangeMethodsToken);
};

const getBalance = async (tokenId: string, accountId: string): Promise<string> => {
  const { view } = await getBurrow();

  try {
    const tokenContract: Contract = await getTokenContract(tokenId);

    const balanceInYocto: string = (await view(
      tokenContract,
      ViewMethodsToken[ViewMethodsToken.ft_balance_of],
      {
        account_id: accountId,
      },
    )) as string;

    return balanceInYocto;
  } catch (err: any) {
    console.error(`Failed to get balance for ${accountId} on ${tokenId} ${err.message}`);
    return "0";
  }
};

export default getBalance;
