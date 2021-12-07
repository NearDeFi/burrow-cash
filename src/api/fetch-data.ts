import { getBurrow } from "../utils";
import {
  getAssetsDetailed,
  getAllMetadata,
  // getPortfolio, getAccount
} from "../store";
import { receivedAssets } from "../redux/assetsSlice";
import { receivedAccount } from "../redux/accountSlice";
import getBalance from "./get-balance";

const fetchData = async (dispatch) => {
  const { account } = await getBurrow();
  const assets = await getAssetsDetailed();
  const tokenIds = assets.map((asset) => asset.token_id);
  const metadata = await getAllMetadata(tokenIds);

  dispatch(receivedAssets({ assets, metadata }));

  const { accountId } = account;

  if (accountId) {
    const tokenBalances = (await Promise.all(tokenIds.map((id) => getBalance(id, accountId))))
      .map((b, i) => ({ [tokenIds[i]]: b }))
      .reduce((a, b) => ({ ...a, ...b }), {});

    const balances = {
      near: (await account.getAccountBalance()).available,
      ...tokenBalances,
    };
    dispatch(receivedAccount({ balances }));
  }
};

export default fetchData;
