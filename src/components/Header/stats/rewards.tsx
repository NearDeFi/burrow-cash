import { useRewards } from "../../../hooks/useRewards";
import { TOKEN_FORMAT, USD_FORMAT } from "../../../store";
import { Stat } from "./components";

export const DailyRewards = () => {
  const { brrr, extra, net } = useRewards();

  const rewards = [brrr, ...extra.flatMap((f) => f[1]), ...net.flatMap((f) => f[1])];

  const labels = rewards.map((r) => ({
    value: r.dailyAmount.toLocaleString(undefined, TOKEN_FORMAT),
    unclaimed: `${r.unclaimedAmount.toLocaleString(undefined, TOKEN_FORMAT)} unclaimed`,
    text: r.symbol,
    icon: r.icon,
  }));

  const amount = rewards.reduce((acc, r) => acc + r.dailyAmount * r.price, 0);

  return (
    <Stat
      title="Daily Rewards"
      amount={amount.toLocaleString(undefined, USD_FORMAT)}
      labels={labels}
    />
  );
};
