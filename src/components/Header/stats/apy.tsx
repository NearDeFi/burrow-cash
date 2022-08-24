import { Link, Stack, Typography } from "@mui/material";

import { Stat } from "./components";
import { useUserHealth } from "../../../hooks/useUserHealth";
import { APY_FORMAT, USD_FORMAT } from "../../../store";
import { useNonFarmedAssets } from "../../../hooks/hooks";

export const APY = () => {
  const { netAPY, netLiquidityAPY, dailyReturns } = useUserHealth();
  const { weightedNetLiquidity, hasNegativeNetLiquidity, assets } = useNonFarmedAssets();

  const globalValue = `${netAPY.toLocaleString(undefined, APY_FORMAT)}%`;
  const netLiquidityValue = `${netLiquidityAPY.toLocaleString(undefined, APY_FORMAT)}%`;
  const amount = `${(netAPY + netLiquidityAPY).toLocaleString(undefined, APY_FORMAT)}%`;

  const netLiquidityTooltip = hasNegativeNetLiquidity ? (
    <NotFarmingNetLiquidity assets={assets} liquidity={weightedNetLiquidity} />
  ) : undefined;

  const apyLabels = [
    [
      { value: globalValue, text: "Pools" },
      { value: netLiquidityValue, text: "Net Liquidity", tooltip: netLiquidityTooltip },
    ],
  ];

  const tooltip = `${dailyReturns.toLocaleString(undefined, USD_FORMAT)} / day`;

  return (
    <Stat
      title="APY"
      titleTooltip="Net APY of all supply and borrow positions, including base APYs and incentives"
      amount={amount}
      tooltip={tooltip}
      labels={apyLabels}
    />
  );
};

const NotFarmingNetLiquidity = ({ assets, liquidity }) => (
  <Stack gap="1">
    <Typography fontSize="0.85rem">
      Your weighted net liquidity is <b>{liquidity.toLocaleString(undefined, USD_FORMAT)}</b> which
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
