import { Box, Stack, Typography } from "@mui/material";
import millify from "millify";

import { PERCENT_DIGITS } from "../../store/constants";
import { formatRewardAmount, formatPortfolioRewardAmount } from "../Table/common/cells";
import { IReward } from "../../interfaces/asset";
import { shrinkToken } from "../../store/helper";
import { useFullDigits } from "../../hooks/useFullDigits";
import TokenIcon from "../TokenIcon";
import HtmlTooltip from "../common/html-tooltip";
import { useNetLiquidityRewards } from "../../hooks/useRewards";

interface Props {
  rewards?: IReward[];
  layout?: "horizontal" | "vertical";
  fontWeight?: "normal" | "bold";
}

const Rewards = ({ rewards: list = [], layout, fontWeight = "normal" }: Props) => {
  const { fullDigits } = useFullDigits();
  const isCompact = fullDigits?.table;
  const isHorizontalLayout = layout === "horizontal";
  const netLiquidityRewards = useNetLiquidityRewards();

  const restRewards = netLiquidityRewards.filter(
    (r) => !list.some((lr) => lr.metadata.symbol === r.metadata.symbol),
  );

  return (
    <RewardsTooltip hidden={!isHorizontalLayout} isCompact={isCompact} list={list}>
      <Stack
        spacing={0.75}
        direction={isHorizontalLayout ? "row" : "column"}
        justifyContent="flex-start"
      >
        {list.map(({ metadata, rewards, config }) => {
          const { symbol, icon, decimals } = metadata;
          const dailyRewards = shrinkToken(
            rewards.reward_per_day || 0,
            decimals + config.extra_decimals,
          );

          const amount = isCompact
            ? millify(Number(dailyRewards), { precision: PERCENT_DIGITS })
            : formatPortfolioRewardAmount(Number(dailyRewards));

          const iconSize = isHorizontalLayout ? 20 : 14;

          if (Number(dailyRewards) < 0.001) return null;

          return (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              justifyContent="flex-end"
              key={symbol}
            >
              {!isHorizontalLayout && (
                <Typography fontSize="0.75rem" fontWeight={fontWeight}>
                  {amount}
                </Typography>
              )}
              <Box height={iconSize}>
                <TokenIcon width={iconSize} height={iconSize} icon={icon} />
              </Box>
            </Stack>
          );
        })}
        {isHorizontalLayout &&
          restRewards.map(({ metadata: { symbol, icon } }) => (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              justifyContent="flex-end"
              key={symbol}
            >
              <Box height={20}>
                <TokenIcon width={20} height={20} icon={icon} />
              </Box>
            </Stack>
          ))}
      </Stack>
    </RewardsTooltip>
  );
};

const RewardsTooltip = ({ children, hidden, isCompact, list }) => {
  if (hidden) return children;

  return (
    <HtmlTooltip
      title={
        <Box display="grid" gridTemplateColumns="1fr 1fr" alignItems="center" gap={1}>
          {list.map(({ metadata, rewards, config }) => {
            const { symbol, icon, decimals } = metadata;
            const dailyRewards = shrinkToken(
              rewards.reward_per_day || 0,
              decimals + config.extra_decimals,
            );
            const amount = isCompact
              ? millify(Number(dailyRewards), { precision: PERCENT_DIGITS })
              : formatRewardAmount(Number(dailyRewards));

            return [
              <Stack key={1} direction="row" alignItems="center" spacing={1}>
                <TokenIcon width={14} height={14} icon={icon} />
                <Typography fontSize="0.75rem">{symbol}</Typography>
              </Stack>,
              <Typography key={2} fontSize="0.75rem" textAlign="right">
                {amount} / day
              </Typography>,
            ];
          })}
        </Box>
      }
    >
      {children}
    </HtmlTooltip>
  );
};

export default Rewards;
