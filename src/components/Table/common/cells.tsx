import { Box, Tooltip, Skeleton, Stack } from "@mui/material";
import { FcInfo } from "@react-icons/all-files/fc/FcInfo";
import millify from "millify";

import TokenIcon from "../../TokenIcon";
import { USD_FORMAT, TOKEN_FORMAT, APY_FORMAT, DUST_FORMAT, NUMBER_FORMAT } from "../../../store";
import type { ExtraReward, UIAsset } from "../../../interfaces";
import { useAppSelector } from "../../../redux/hooks";
import { getDisplayAsTokenValue, getShowDust } from "../../../redux/appSelectors";
import { BRRRPrice, ExtraRewards } from "../../index";
import { useIsBurrowToken, useFullDigits } from "../../../hooks";

export const TokenCell = ({ rowData }) => {
  const isBurrowToken = useIsBurrowToken(rowData.tokenId);

  return (
    <Box display="flex">
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
  extraRewards,
}: {
  value: number | string;
  rowData: UIAsset | undefined;
  format: FormatType;
  tooltip?: string;
  extraRewards?: ExtraReward[];
}) => {
  if (!rowData) return <Skeleton sx={{ bgcolor: "gray" }} height={32} />;

  const { price } = rowData;
  const displayAsTokenValue = useAppSelector(getDisplayAsTokenValue);
  const showDust = useAppSelector(getShowDust);
  const { fullDigits } = useFullDigits();
  const isCompact = fullDigits.table;

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
    reward: (v) => (isCompact ? millify(Number(v)) : formatBRRRAmount(Number(v))),
    usd: (v) => (isCompact ? `$${millify(Number(v))}` : v.toLocaleString(undefined, USD_FORMAT)),
  };

  const displayValue = formatMap[format](value);

  return tooltip ? (
    <Tooltip title={tooltip} placement="top" arrow disableFocusListener>
      <Box>{displayValue}</Box>
    </Tooltip>
  ) : extraRewards?.length ? (
    <Stack spacing={1}>
      <Box>{displayValue}</Box>
      <ExtraRewards rewards={extraRewards} />
    </Stack>
  ) : (
    <Box>{displayValue}</Box>
  );
};

export const Label = ({ name, title }) => (
  <Tooltip title={title}>
    <span>
      {name} <FcInfo />
    </span>
  </Tooltip>
);

export const formatBRRRAmount = (amount: number) =>
  amount < 0.001 ? "<0.001" : amount.toLocaleString(undefined, NUMBER_FORMAT);
