import { useRewards } from "../../../hooks/useRewards";
import { TOKEN_FORMAT, USD_FORMAT } from "../../../store";
import { Stat } from "./components";

const transformReward = (r) => ({
  value: r.dailyAmount.toLocaleString(undefined, TOKEN_FORMAT),
  unclaimed: `${r.unclaimedAmount.toLocaleString(undefined, TOKEN_FORMAT)} unclaimed`,
  text: r.symbol,
  icon: r.icon,
});

const sumRewards = (acc, r) => acc + r.dailyAmount * r.price;

export const DailyRewards = () => {
  const { brrr, extra, net } = useRewards();

  const assetRewards = [
    ...(Object.entries(brrr).length > 0 ? [brrr] : []),
    ...extra.flatMap((f) => f[1]),
  ];

  const netRewards = net.flatMap((f) => f[1]);

  const labels = assetRewards.map(transformReward);
  const netLabels = netRewards.map(transformReward);

  const amount = assetRewards.reduce(sumRewards, 0) + netRewards.reduce(sumRewards, 0);

  return (
    <Stat
      title="Daily Rewards"
      amount={amount.toLocaleString(undefined, USD_FORMAT)}
      labels={[...labels, { text: "Net Liquidity:" }, ...netLabels]}
    />
  );
};
