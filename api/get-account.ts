import { getAssetsDetailed } from "../store";

import getBalance from "./get-balance";
import getPortfolio from "./get-portfolio";
import { getAccount as getAccountWallet } from "../utils/wallet-selector-compat";

const getAccount = async () => {
  const account = await getAccountWallet();
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
