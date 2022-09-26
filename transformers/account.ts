import { initialStaking } from "../redux/accountState";
import { hasZeroSharesFarmRewards, listToMap } from "../redux/utils";
import { transformAccountFarms } from "./farms";

export const transformPortfolio = (account) => {
  const { portfolio } = account;
  if (!portfolio) return undefined;

  const { booster_staking, supplied, borrowed, collateral, farms } = portfolio;

  return {
    supplied: listToMap(supplied),
    borrowed: listToMap(borrowed),
    collateral: listToMap(collateral),
    farms: transformAccountFarms(farms),
    staking: booster_staking || initialStaking,
    hasNonFarmedAssets:
      account.portfolio["has_non_farmed_assets"] || hasZeroSharesFarmRewards(farms),
  };
};

export const transformAccount = (account) => {
  if (!account) return undefined;

  const { accountId, accountBalance, tokenIds } = account;

  return {
    accountId,
    balances: {
      ...account.balances
        .map((b, i) => ({ [tokenIds[i]]: b }))
        .reduce((a, b) => ({ ...a, ...b }), {}),
      near: accountBalance,
    },
    portfolio: transformPortfolio(account),
  };
};
