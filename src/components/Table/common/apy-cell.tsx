import { Box, Typography, Stack, useTheme } from "@mui/material";
import { hiddenAssets } from "../../../config";

import { useConfig } from "../../../hooks/hooks";
import HtmlTooltip from "../../common/html-tooltip";
import TokenIcon from "../../TokenIcon";
import { APY_FORMAT } from "../../../store/constants";
import { computeRewardAPY, getExtraAPY } from "../../../redux/selectors/getNetAPY";
import { useBoostedAPY } from "../../../hooks/useBoostedAPY";

const toAPY = (v) => v.toLocaleString(undefined, APY_FORMAT);

const APYCell = ({
  baseAPY,
  rewards: list,
  totalSupplyMoney,
  page,
  tokenId,
  showIcons = true,
  sx = {},
  isStaking = false,
}) => {
  const appConfig = useConfig();
  const getStakingBoostedAPY = useBoostedAPY();
  const extraRewards = list?.filter((r) => r?.metadata?.token_id !== appConfig.booster_token_id);
  const hasRewards = extraRewards?.length > 0;
  const isBorrow = page === "borrow";

  if (hiddenAssets.includes(tokenId)) return <Box />;

  const extraAPY = getExtraAPY(extraRewards, totalSupplyMoney) * 100;

  const extraStakingAPY = extraRewards.reduce((acc: number, { metadata }) => {
    const boostedStakingAPY = getStakingBoostedAPY(
      isBorrow ? "borrowed" : "supplied",
      tokenId,
      metadata.token_id,
    );

    return acc + boostedStakingAPY;
  }, 0);

  const sign = isBorrow ? -1 : 1;
  const boostedAPY = baseAPY + sign * (isStaking ? extraStakingAPY : extraAPY);
  const isLucky = isBorrow && boostedAPY <= 0;

  return (
    <ToolTip
      tokenId={tokenId}
      list={extraRewards}
      baseAPY={baseAPY}
      totalSupplyMoney={totalSupplyMoney}
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
        justifyContent="flex-end"
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
  totalSupplyMoney,
  isBorrow,
  boostedAPY,
  isLucky,
  isStaking,
}) => {
  const theme = useTheme();
  const getStakingBoostedAPY = useBoostedAPY();
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
          {list.map(({ metadata, rewards, price, config }) => {
            const { symbol, icon, decimals } = metadata;

            const boostedStakingAPY = getStakingBoostedAPY(
              isBorrow ? "borrowed" : "supplied",
              tokenId,
              metadata.token_id,
            );

            const rewardAPY =
              computeRewardAPY(
                rewards.reward_per_day,
                decimals + config.extra_decimals,
                price || 0,
                totalSupplyMoney,
              ) * 100;

            return [
              <Stack key={1} direction="row" alignItems="center" spacing={1}>
                <TokenIcon width={14} height={14} icon={icon} />
                <Typography fontSize="0.75rem">{symbol}</Typography>
              </Stack>,
              <Typography key={2} fontSize="0.75rem" textAlign="right">
                {isBorrow ? "-" : ""}
                {toAPY(isStaking ? boostedStakingAPY : rewardAPY)}%
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
