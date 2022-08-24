import { useRewards } from "../../../hooks/useRewards";
import { TOKEN_FORMAT, USD_FORMAT, NUMBER_FORMAT } from "../../../store";
import { Stat } from "./components";

const transformAssetReward = (r) => ({
  value: r.dailyAmount.toLocaleString(undefined, TOKEN_FORMAT),
  tooltip: `${r.unclaimedAmount.toLocaleString(undefined, TOKEN_FORMAT)} unclaimed`,
  text: r.symbol,
  icon: r.icon,
});

const sumRewards = (acc, r) => acc + r.dailyAmount * r.price;

export const UserDailyRewards = () => {
  const { brrr, extra, net } = useRewards();

  const assetRewards = [
    ...(Object.entries(brrr).length > 0 ? [brrr] : []),
    ...extra.flatMap((f) => f[1]),
  ];

  const netRewards = net.flatMap((f) => f[1]);

  const assetLabels = assetRewards.map(transformAssetReward);
  const netLabels = netRewards.map(transformAssetReward);

  const labels = [
    [{ text: "Pools:" }, ...assetLabels],
    [{ text: "Net Liquidity:" }, ...netLabels],
  ];
  const amount = assetRewards.reduce(sumRewards, 0) + netRewards.reduce(sumRewards, 0);

  return (
    <Stat
      title="Daily Rewards"
      titleTooltip="Estimated daily rewards combing base APYs and all incentives"
      amount={amount.toLocaleString(undefined, USD_FORMAT)}
      labels={labels}
    />
  );
};

const transformProtocolReward = (r) => ({
  value: r.dailyAmount.toLocaleString(undefined, NUMBER_FORMAT),
  tooltip: `${r.remainingAmount.toLocaleString(undefined, TOKEN_FORMAT)} remaining`,
  text: r.symbol,
  icon: r.icon,
});

export const ProtocolDailyRewards = () => {
  const { protocol } = useRewards();

  const labels = protocol.map(transformProtocolReward);
  const amount = protocol.reduce(sumRewards, 0);

  return (
    <Stat
      title="Net Liquidity Daily Rewards"
      titleTooltip="Total protocol daily rewards from net liquidity"
      amount={amount.toLocaleString(undefined, USD_FORMAT)}
      labels={[labels]}
    />
  );
};
