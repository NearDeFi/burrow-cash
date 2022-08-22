import { Stat } from "./components";
import { useUserHealth } from "../../../hooks/useUserHealth";
import { APY_FORMAT, USD_FORMAT } from "../../../store";

export const APY = () => {
  const { netAPY, netTvlAPY, dailyReturns } = useUserHealth();
  const globalValue = `${netAPY.toLocaleString(undefined, APY_FORMAT)}%`;
  const netTvlValue = `${netTvlAPY.toLocaleString(undefined, APY_FORMAT)}%`;
  const amount = `${(netAPY + netTvlAPY).toLocaleString(undefined, APY_FORMAT)}%`;

  const apyLabels = [
    { value: globalValue, text: "Pools" },
    { value: netTvlValue, text: "Net Liquidity" },
  ];

  const tooltip = `${dailyReturns.toLocaleString(undefined, USD_FORMAT)} / day`;

  return (
    <Stat
      title="APY"
      titleTooltip="Your total APY"
      amount={amount}
      tooltip={tooltip}
      labels={[apyLabels]}
    />
  );
};
