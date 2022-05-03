import Decimal from "decimal.js";
import { Box, Typography, Stack, useTheme } from "@mui/material";

import { useConfig } from "../../../hooks";
import HtmlTooltip from "../../common/html-tooltip";
import TokenIcon from "../../TokenIcon";
import { APY_FORMAT } from "../../../store/constants";

const toAPY = (v) => v.toLocaleString(undefined, APY_FORMAT);

const computeRewardAPY = (rewards, decimals, price, totalSupplyMoney) =>
  new Decimal(rewards.reward_per_day)
    .div(new Decimal(10).pow(decimals))
    .mul(365)
    .mul(price)
    .div(totalSupplyMoney)
    .mul(100)
    .toNumber();

const APYCell = ({ baseAPY, rewards: list, totalSupplyMoney, page }) => {
  const config = useConfig();
  const extraRewards = list?.filter((r) => r.metadata.token_id !== config.booster_token_id);
  const hasRewards = extraRewards?.length > 0;
  const isBorrow = page === "borrow";

  const extraAPY =
    extraRewards?.reduce(
      (acc, { rewards, metadata, price }) =>
        acc + computeRewardAPY(rewards, metadata.decimals, price, totalSupplyMoney),
      0,
    ) || 0;

  const boostedAPY = isBorrow ? baseAPY - extraAPY : baseAPY + extraAPY;

  return (
    <ToolTip
      list={extraRewards}
      baseAPY={baseAPY}
      totalSupplyMoney={totalSupplyMoney}
      isBorrow={isBorrow}
    >
      <Stack direction="row" gap="3px" alignItems="center">
        <Typography fontSize="0.85rem" fontWeight="bold" textAlign="right" minWidth="50px">
          {toAPY(boostedAPY)}%
        </Typography>
        {hasRewards ? (
          <Box component="span" ml="3px">
            🚀
          </Box>
        ) : (
          <Box width="14px" />
        )}
      </Stack>
    </ToolTip>
  );
};

const ToolTip = ({ children, list, baseAPY, totalSupplyMoney, isBorrow }) => {
  const theme = useTheme();
  if (!list?.length) return children;

  const extraAPY =
    list?.reduce(
      (acc, { rewards, metadata, price }) =>
        acc + computeRewardAPY(rewards, metadata.decimals, price, totalSupplyMoney),
      0,
    ) || 0;

  const boostedAPY = isBorrow ? baseAPY - extraAPY : baseAPY + extraAPY;

  return (
    <HtmlTooltip
      title={
        <Box display="grid" gridTemplateColumns="1fr 1fr" alignItems="center" gap={1} p={1}>
          {list.map(({ metadata, rewards, price }) => {
            const { symbol, icon, decimals } = metadata;
            const rewardAPY = computeRewardAPY(rewards, decimals, price, totalSupplyMoney);

            return [
              <Stack key={1} direction="row" alignItems="center" spacing={1}>
                <TokenIcon width={14} height={14} icon={icon} />
                <Typography fontSize="0.75rem">{symbol}</Typography>
              </Stack>,
              <Typography key={2} fontSize="0.75rem" textAlign="right">
                {toAPY(rewardAPY)}%
              </Typography>,
            ];
          })}
          <Typography pl="22px" fontSize="0.75rem">
            Base APY
          </Typography>
          <Typography fontSize="0.75rem" textAlign="right">
            {toAPY(baseAPY)}%
          </Typography>
          <Box
            gridColumn="1 / span 2"
            component="hr"
            sx={{
              width: "100%",
              borderWidth: 0.5,
              bgcolor: theme.palette.background.default,
              borderStyle: "outset",
            }}
          />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box component="span">🚀</Box>
            <Typography fontSize="0.75rem">Boosted APY</Typography>
          </Stack>
          <Typography fontSize="0.75rem" textAlign="right">
            {toAPY(boostedAPY)}%
          </Typography>
        </Box>
      }
    >
      {children}
    </HtmlTooltip>
  );
};

export default APYCell;