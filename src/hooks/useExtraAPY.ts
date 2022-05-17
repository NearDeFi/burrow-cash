import Decimal from "decimal.js";

import { getTotalSupplyAndBorrowUSD } from "../redux/assetsSelectors";
import { useAppSelector } from "../redux/hooks";

export function useExtraAPY({ tokenId, isBorrow }) {
  const [totalSupplyUSD, totalBorrowUSD] = useAppSelector(getTotalSupplyAndBorrowUSD(tokenId));

  const computeRewardAPY = (rewardsPerDay, decimals, price) => {
    return new Decimal(rewardsPerDay)
      .div(new Decimal(10).pow(decimals))
      .mul(365)
      .mul(price)
      .div(isBorrow ? totalBorrowUSD : totalSupplyUSD)
      .mul(100)
      .toNumber();
  };

  return { computeRewardAPY };
}
