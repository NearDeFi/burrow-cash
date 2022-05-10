import { useAppSelector } from "../redux/hooks";
import { getStaking } from "../redux/accountSelectors";
import { getConfig } from "../redux/appSelectors";
import { shrinkToken } from "../store";

export function useStaking() {
  const staking = useAppSelector(getStaking);
  const config = useAppSelector(getConfig);

  const BRRR = Number(shrinkToken(staking["staked_booster_amount"], config.booster_decimals));
  const xBRRR = Number(shrinkToken(staking["x_booster_amount"], config.booster_decimals));

  return { BRRR, xBRRR, staking, config };
}
