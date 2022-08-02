import { useAppSelector } from "../redux/hooks";
import { getAccountRewards } from "../redux/selectors/getAccountRewards";
import { getNetLiquidityRewards, getProtocolRewards } from "../redux/selectors/getProtocolRewards";

export function useRewards() {
  const assetRewards = useAppSelector(getAccountRewards);
  const protocol = useAppSelector(getProtocolRewards);

  const { brrr } = assetRewards;
  const extra = Object.entries(assetRewards.extra);
  const net = Object.entries(assetRewards.net);

  return { brrr, extra, net, protocol };
}

export function useNetLiquidityRewards() {
  const rewards = useAppSelector(getNetLiquidityRewards);
  return rewards;
}
