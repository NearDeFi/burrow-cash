import { Stat } from "./components";
import { useAccountId } from "../../../hooks/hooks";
import { useUserHealth } from "../../../hooks/useUserHealth";
import { APY_FORMAT } from "../../../store";

export const APY = () => {
  const accountId = useAccountId();
  const { netAPY, netTvlAPY } = useUserHealth();
  const globalValue = `${netAPY.toLocaleString(undefined, APY_FORMAT)}%`;
  const netTvlValue = `${netTvlAPY.toLocaleString(undefined, APY_FORMAT)}%`;
  const amount = `${(netAPY + netTvlAPY).toLocaleString(undefined, APY_FORMAT)}%`;

  const apyLabels = [
    { value: globalValue, text: "Global" },
    { value: netTvlValue, text: "Net TVL" },
  ];

  if (!accountId) return null;

  return <Stat title="APY" amount={amount} labels={apyLabels} />;
};
