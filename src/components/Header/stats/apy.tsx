import { Stat } from "./components";
import { useUserHealth } from "../../../hooks/useUserHealth";
import { APY_FORMAT } from "../../../store";

export const APY = () => {
  const { netAPY, netTvlAPY } = useUserHealth();
  const globalValue = `${netAPY.toLocaleString(undefined, APY_FORMAT)}%`;
  const netTvlValue = `${netTvlAPY.toLocaleString(undefined, APY_FORMAT)}%`;
  const amount = `${(netAPY + netTvlAPY).toLocaleString(undefined, APY_FORMAT)}%`;

  const apyLabels = [
    { value: globalValue, text: "Pools" },
    { value: netTvlValue, text: "Net Liquidity" },
  ];

  return <Stat title="APY" amount={amount} labels={[apyLabels]} />;
};
