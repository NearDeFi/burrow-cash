import { getAssetsDetailed } from "../store";

import getBalance from "./get-balance";
import getPortfolio from "./get-portfolio";
import { getBurrow } from "../utils";

const getAccount = async () => {
  const { account } = await getBurrow();
  const { accountId } = account;

  if (accountId) {
    const assets = await getAssetsDetailed();
    const tokenIds = assets.map((asset) => asset.token_id);
    const accountBalance = (await account.getAccountBalance()).available;
    const balances = await Promise.all(tokenIds.map((id) => getBalance(id, accountId)));
    const portfolio = await getPortfolio(accountId);
    return { accountId, accountBalance, balances, portfolio, tokenIds };
  }

  return undefined;
};

export default getAccount;
