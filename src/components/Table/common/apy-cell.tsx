import { Box, Typography, Stack, useTheme } from "@mui/material";
import { hiddenAssets } from "../../../config";

import HtmlTooltip from "../../common/html-tooltip";
import TokenIcon from "../../TokenIcon";
import { APY_FORMAT } from "../../../store/constants";
import { useExtraAPY } from "../../../hooks/useExtraAPY";

const toAPY = (v) => v.toLocaleString(undefined, APY_FORMAT);

const APYCell = ({
  baseAPY,
  rewards: list,
  page,
  tokenId,
  showIcons = true,
  isStaking = false,
  justifyContent = "flex-end",
  sx = {},
}) => {
  const isBorrow = page === "borrow";
  const { computeRewardAPY, computeStakingRewardAPY } = useExtraAPY({ tokenId, isBorrow });
  const hasRewards = list?.length > 0;

  if (hiddenAssets.includes(tokenId)) return <Box />;

  const extraAPY = list.reduce((acc: number, { metadata, rewards, price, config }) => {
    const apy = computeRewardAPY(
      metadata.token_id,
      rewards.reward_per_day,
      metadata.decimals + config.extra_decimals,
      price || 0,
    );

    return acc + apy;
  }, 0);

  const stakingExtraAPY = list.reduce((acc: number, { metadata }) => {
    const apy = computeStakingRewardAPY(metadata.token_id);
    return acc + apy;
  }, 0);

  const sign = isBorrow ? -1 : 1;
  const apy = isStaking ? stakingExtraAPY : extraAPY;
  const boostedAPY = baseAPY + sign * apy;
  const isLucky = isBorrow && boostedAPY <= 0;

  return (
    <ToolTip
      tokenId={tokenId}
      list={list}
      baseAPY={baseAPY}
      isBorrow={isBorrow}
      boostedAPY={boostedAPY}
      isLucky={isLucky}
      isStaking={isStaking}
    >
      <Stack
        position="relative"
        direction="row"
        gap="3px"
        alignItems="center"
        justifyContent={justifyContent}
      >
        <Typography fontSize="0.85rem" fontWeight="bold" textAlign="right" minWidth="50px" sx={sx}>
          {toAPY(boostedAPY)}%
        </Typography>
        {hasRewards && showIcons && (
          <Box component="span" position="absolute" right="-22px">
            {isLucky ? "🍀" : "🚀"}
          </Box>
        )}
      </Stack>
    </ToolTip>
  );
};

const ToolTip = ({
  children,
  tokenId,
  list,
  baseAPY,
  isBorrow,
  boostedAPY,
  isLucky,
  isStaking,
}) => {
  const theme = useTheme();
  const { computeRewardAPY, computeStakingRewardAPY } = useExtraAPY({ tokenId, isBorrow });
  if (!list?.length) return children;

  return (
    <HtmlTooltip
      title={
        <Box display="grid" gridTemplateColumns="1fr 1fr" alignItems="center" gap={1} p={1}>
          <Typography pl="22px" fontSize="0.75rem">
            Base APY
          </Typography>
          <Typography fontSize="0.75rem" textAlign="right">
            {toAPY(baseAPY)}%
          </Typography>
          {list.map(({ rewards, metadata, price, config }) => {
            const { symbol, icon } = metadata;

            const rewardAPY = computeRewardAPY(
              metadata.token_id,
              rewards.reward_per_day,
              metadata.decimals + config.extra_decimals,
              price || 0,
            );

            const stakingRewardAPY = computeStakingRewardAPY(metadata.token_id);

            return [
              <Stack key={1} direction="row" alignItems="center" spacing={1}>
                <TokenIcon width={14} height={14} icon={icon} />
                <Typography fontSize="0.75rem">{symbol}</Typography>
              </Stack>,
              <Typography key={2} fontSize="0.75rem" textAlign="right">
                {isBorrow ? "-" : ""}
                {toAPY(isStaking ? stakingRewardAPY : rewardAPY)}%
              </Typography>,
            ];
          })}
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
            <Box component="span">{isLucky ? "🍀" : "🚀"}</Box>
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
