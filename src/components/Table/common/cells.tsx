import millify from "millify";
import { Box, Tooltip, Skeleton } from "@mui/material";

import { USD_FORMAT, TOKEN_FORMAT, APY_FORMAT, DUST_FORMAT, NUMBER_FORMAT } from "../../../store";
import type { IReward, UIAsset } from "../../../interfaces";
import { useAppSelector } from "../../../redux/hooks";
import { getDisplayAsTokenValue, getShowDust } from "../../../redux/appSelectors";
import { Rewards } from "../../index";
import { useFullDigits } from "../../../hooks/useFullDigits";
import APYCell from "./apy-cell";

type FormatType = "apy" | "amount" | "string" | "reward" | "usd";
type FormatMap = {
  [t in FormatType]: (v: number | string) => string;
};

export const Cell = ({
  value,
  rowData,
  format,
  tooltip,
  rewards,
  rewardLayout,
  page,
}: {
  value?: number | string;
  rowData: UIAsset | undefined;
  format: FormatType;
  tooltip?: string;
  rewards?: IReward[];
  rewardLayout?: "horizontal" | "vertical";
  page?: "deposit" | "borrow";
}) => {
  if (!rowData) return <Skeleton sx={{ bgcolor: "gray" }} height={32} />;

  const { price } = rowData;
  const displayAsTokenValue = useAppSelector(getDisplayAsTokenValue);
  const showDust = useAppSelector(getShowDust);
  const { fullDigits } = useFullDigits();
  const isCompact = fullDigits?.table;
  const isReward = format === "reward";
  const isAPY = format === "apy";

  const formatMap: FormatMap = {
    apy: (v) => `${v.toLocaleString(undefined, APY_FORMAT)}%`,
    amount: (v) =>
      displayAsTokenValue
        ? isCompact
          ? millify(Number(v))
          : Number(v).toLocaleString(undefined, showDust ? DUST_FORMAT : TOKEN_FORMAT)
        : isCompact
        ? `$${millify(Number(v) * price)}`
        : (Number(v) * price).toLocaleString(undefined, USD_FORMAT),
    string: (v) => v.toString(),
    reward: (v) => (isCompact ? millify(Number(v)) : formatRewardAmount(Number(v))),
    usd: (v) => (isCompact ? `$${millify(Number(v))}` : v.toLocaleString(undefined, USD_FORMAT)),
  };

  if (isAPY)
    return <APYCell rewards={rewards} baseAPY={value} page={page} tokenId={rowData.tokenId} />;
  if (isReward) return <Rewards rewards={rewards} layout={rewardLayout} page={page} />;
  if (!value) return <Box>-</Box>;

  const displayValue = formatMap[format](value);

  return tooltip ? (
    <Tooltip title={tooltip} placement="top" arrow disableFocusListener>
      <Box>{displayValue}</Box>
    </Tooltip>
  ) : (
    <Box>{displayValue}</Box>
  );
};

export const formatRewardAmount = (amount: number) =>
  amount < 0.001 ? "<0.001" : amount.toLocaleString(undefined, NUMBER_FORMAT);

export const formatPortfolioRewardAmount = (amount: number) =>
  amount < 0.001 ? "<0.001" : amount.toLocaleString(undefined, TOKEN_FORMAT);
