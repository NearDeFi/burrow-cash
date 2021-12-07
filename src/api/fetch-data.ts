import { omit } from "ramda";

import { getBurrow } from "../utils";
import { getAssetsDetailed, getAllMetadata } from "../store";
import { receivedAssets } from "../redux/assetsSlice";
import { receivedAccount } from "../redux/accountSlice";
import getBalance from "./get-balance";
import getPortfolio from "./get-portfolio";

const listToMap = (list) =>
  list
    .map((asset) => ({ [asset.token_id]: omit(["token_id"], asset) }))
    .reduce((a, b) => ({ ...a, ...b }), {});

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

    const { supplied, borrowed, collateral } = await getPortfolio(accountId);

    const portfolio = {
      supplied: listToMap(supplied),
      borrowed: listToMap(borrowed),
      collateral: listToMap(collateral),
    };

    dispatch(receivedAccount({ accountId, balances, portfolio }));
  }
};

export default fetchData;
