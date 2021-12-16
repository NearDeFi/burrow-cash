import { getBurrow } from "../utils";
import { getAssetsDetailed, getAllMetadata } from "../store";
import { receivedAssets } from "../redux/assetsSlice";
import { receivedAccount } from "../redux/accountSlice";
import getBalance from "./get-balance";
import getPortfolio from "./get-portfolio";

const fetchData = async (dispatch) => {
  const { account } = await getBurrow();
  const assets = await getAssetsDetailed();
  const tokenIds = assets.map((asset) => asset.token_id);
  const metadata = await getAllMetadata(tokenIds);

  dispatch(receivedAssets({ assets, metadata }));

  const { accountId } = account;

  if (accountId) {
    const accountBalance = (await account.getAccountBalance()).available;
    const balances = await Promise.all(tokenIds.map((id) => getBalance(id, accountId)));
    const portfolio = await getPortfolio(accountId);
    dispatch(receivedAccount({ accountId, accountBalance, balances, portfolio, tokenIds }));
  }
};

export default fetchData;
