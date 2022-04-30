import { useState } from "react";
import { Box, Tooltip, Skeleton } from "@mui/material";
import { FcInfo } from "@react-icons/all-files/fc/FcInfo";
import millify from "millify";

import TokenIcon from "../../TokenIcon";
import { USD_FORMAT, TOKEN_FORMAT, APY_FORMAT, DUST_FORMAT, NUMBER_FORMAT } from "../../../store";
import type { IReward, UIAsset } from "../../../interfaces";
import { useAppSelector } from "../../../redux/hooks";
import { getDisplayAsTokenValue, getShowDust } from "../../../redux/appSelectors";
import { BRRRPrice, Rewards } from "../../index";
import { useIsBurrowToken, useFullDigits } from "../../../hooks";

export const TokenCell = ({ rowData }) => {
  const isBurrowToken = useIsBurrowToken(rowData.tokenId);

  return (
    <Box display="flex" alignItems="center">
      <Box>
        {rowData ? (
          <TokenIcon icon={rowData?.icon} />
        ) : (
          <Skeleton sx={{ bgcolor: "gray" }} width={35} height={35} variant="circular" />
        )}
      </Box>
      <Box px="1rem">
        {rowData ? (
          <>
            <Box>{rowData.symbol}</Box>
            {isBurrowToken ? (
              <BRRRPrice />
            ) : (
              <Box>{rowData.price.toLocaleString(undefined, USD_FORMAT) || "$-.-"}</Box>
            )}
          </>
        ) : (
          <>
            <Skeleton sx={{ bgcolor: "gray" }} width={40} height={20} />
            <Skeleton sx={{ bgcolor: "gray" }} width={50} height={20} />
          </>
        )}
      </Box>
    </Box>
  );
};

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
}: {
  value?: number | string;
  rowData: UIAsset | undefined;
  format: FormatType;
  tooltip?: string;
  rewards?: IReward[];
  rewardLayout?: "horizontal" | "vertical";
}) => {
  if (!rowData) return <Skeleton sx={{ bgcolor: "gray" }} height={32} />;

  const { price } = rowData;
  const displayAsTokenValue = useAppSelector(getDisplayAsTokenValue);
  const showDust = useAppSelector(getShowDust);
  const { fullDigits } = useFullDigits();
  const isCompact = fullDigits.table;
  const isReward = format === "reward";

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

  if (isReward) return <Rewards rewards={rewards} layout={rewardLayout} />;
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

export const Label = ({ name, title }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleOpenTooltip = (e) => {
    setShowTooltip(true);
    e.stopPropagation();
  };

  return (
    <Tooltip
      title={title}
      open={showTooltip}
      onOpen={() => setShowTooltip(true)}
      onClose={() => setShowTooltip(false)}
    >
      <Box>
        {name} <FcInfo onClick={handleOpenTooltip} />
      </Box>
    </Tooltip>
  );
};

export const formatRewardAmount = (amount: number) =>
  amount < 0.001 ? "<0.001" : amount.toLocaleString(undefined, NUMBER_FORMAT);

export const formatPortfolioRewardAmount = (amount: number) =>
  amount < 0.001 ? "<0.001" : amount.toLocaleString(undefined, TOKEN_FORMAT);
