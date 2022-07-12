import { useAppSelector } from "../redux/hooks";
import { getAccountRewards } from "../redux/selectors/getAccountRewards";
import { getProtocolRewards } from "../redux/selectors/getProtocolRewards";

export function useRewards() {
  const assetRewards = useAppSelector(getAccountRewards);
  const protocol = useAppSelector(getProtocolRewards);

  const { brrr } = assetRewards;
  const extra = Object.entries(assetRewards.extra);
  const net = Object.entries(assetRewards.net);

  return { brrr, extra, net, protocol };
}
