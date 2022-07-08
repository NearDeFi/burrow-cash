import { useAppSelector } from "../redux/hooks";
import { getAccountRewards } from "../redux/selectors/getAccountRewards";

export function useRewards() {
  const rewards = useAppSelector(getAccountRewards);

  const { brrr } = rewards;
  const extra = Object.entries(rewards.extra);
  const net = Object.entries(rewards.net);

  return { brrr, extra, net };
}
