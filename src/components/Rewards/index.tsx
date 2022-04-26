import { Box, Tooltip, Stack, Typography } from "@mui/material";
import millify from "millify";

import { PERCENT_DIGITS } from "../../store/constants";
import { formatRewardAmount, formatPortfolioRewardAmount } from "../Table/common/cells";
import { IReward } from "../../interfaces/asset";
import { shrinkToken } from "../../store/helper";
import { useFullDigits } from "../../hooks";
import TokenIcon from "../TokenIcon";

interface Props {
  rewards?: IReward[];
  layout?: "horizontal" | "vertical";
}

const Rewards = ({ rewards: list, layout }: Props) => {
  const { fullDigits } = useFullDigits();
  const isCompact = fullDigits.table;
  const isHorizontalLayout = layout === "horizontal";

  if (!list) return null;
  return (
    <Stack spacing={1} direction={isHorizontalLayout ? "row" : "column"} justifyContent="flex-end">
      {list.map(({ metadata, rewards, config, type }) => {
        const { symbol, name, icon, decimals } = metadata;
        const dailyRewards = shrinkToken(
          rewards.reward_per_day || 0,
          decimals + config.extra_decimals,
        );

        const isPortfolio = type === "portfolio";
        const amount = isCompact
          ? millify(Number(dailyRewards), { precision: PERCENT_DIGITS })
          : isPortfolio
          ? formatPortfolioRewardAmount(Number(dailyRewards))
          : formatRewardAmount(Number(dailyRewards));

        return (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            justifyContent="flex-end"
            key={symbol}
          >
            {!isHorizontalLayout && <Typography fontSize="0.75rem">{amount}</Typography>}
            <Tooltip title={`${symbol} (${name}) - ${amount} / day`}>
              <Box height={14}>
                <TokenIcon width={14} height={14} icon={icon} />
              </Box>
            </Tooltip>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default Rewards;
