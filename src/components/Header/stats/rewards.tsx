import { Link, Stack, Typography } from "@mui/material";
import { useNonFarmedAssets } from "../../../hooks/hooks";
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
  const { adjustedNetLiquidity, hasNegativeNetLiquidity, assets } = useNonFarmedAssets();

  const assetRewards = [
    ...(Object.entries(brrr).length > 0 ? [brrr] : []),
    ...extra.flatMap((f) => f[1]),
  ];

  const netRewards = net.flatMap((f) => f[1]);

  const assetLabels = assetRewards.map(transformAssetReward);
  const netLabels = hasNegativeNetLiquidity
    ? [
        {
          value: "not farming...",
          tooltip: <NotFarmingNetLiquidity assets={assets} liquidity={adjustedNetLiquidity} />,
        },
      ]
    : netRewards.map(transformAssetReward);

  const labels = [
    [{ text: "Pools:" }, ...assetLabels],
    [{ text: "Net Liquidity:" }, ...netLabels],
  ];
  const amount = assetRewards.reduce(sumRewards, 0) + netRewards.reduce(sumRewards, 0);

  return (
    <Stat
      title="Daily Rewards"
      amount={amount.toLocaleString(undefined, USD_FORMAT)}
      labels={labels}
    />
  );
};

const NotFarmingNetLiquidity = ({ assets, liquidity }) => (
  <Stack gap="1">
    <Typography fontSize="0.85rem">
      Your adjusted net liquidity is <b>{liquidity.toLocaleString(undefined, USD_FORMAT)}</b> which
      is below 0.
    </Typography>
    <Typography fontSize="0.85rem">
      The following assets have the net liquidity coefficient below 1:
      <Stack gap={1} component="span" direction="row" display="inline-flex" ml={1}>
        {assets.map((asset) => (
          <span key={asset.token_id}>
            {asset.metadata.symbol} ({asset.config.net_tvl_multiplier / 10000})
          </span>
        ))}
      </Stack>
    </Typography>
    <Typography fontSize="0.85rem">
      In order to start farming the net liquidity rewards you need to have a positive balance.
    </Typography>
    <Typography fontSize="0.85rem">
      For more information about the net liquidity coefficients{" "}
      <Link
        href="https://burrowcash.medium.com/net-liquidity-farming-part-2-varied-coefficients-6b839ae2178b"
        target="_blank"
        color="#ACFFD1"
        fontWeight={500}
      >
        click here
      </Link>
    </Typography>
  </Stack>
);

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
      amount={amount.toLocaleString(undefined, USD_FORMAT)}
      labels={[labels]}
    />
  );
};
