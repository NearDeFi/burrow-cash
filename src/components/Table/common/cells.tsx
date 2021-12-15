import { Box } from "@mui/material";

import TokenIcon from "../../TokenIcon";
import { USD_FORMAT, TOKEN_FORMAT, APY_FORMAT, DUST_FORMAT } from "../../../store";
import type { UIAsset } from "../../../interfaces";
import { useAppSelector } from "../../../redux/hooks";
import { getDisplayAsTokenValue, getShowDust } from "../../../redux/appSlice";

export const TokenCell = ({ rowData }) => {
  const { symbol, price } = rowData;
  const displaySymbol = symbol === "wNEAR" ? "NEAR" : symbol;
  return (
    <Box display="flex">
      <Box>
        <TokenIcon icon={rowData?.icon} />
      </Box>
      <Box px="1rem">
        <Box>{displaySymbol}</Box>
        <Box>{price.toLocaleString(undefined, USD_FORMAT) || "$-.-"}</Box>
      </Box>
    </Box>
  );
};

type FormatType = "apy" | "amount" | "string";
type FormatMap = {
  [t in FormatType]: (v: number | string) => string;
};

export const Cell = ({
  value,
  rowData,
  format,
}: {
  value: number | string;
  rowData: UIAsset;
  format: FormatType;
}) => {
  const { price$ } = rowData;
  const displayAsTokenValue = useAppSelector(getDisplayAsTokenValue);
  const showDust = useAppSelector(getShowDust);

  const formatMap: FormatMap = {
    apy: (v) => `${v.toLocaleString(undefined, APY_FORMAT)}%`,
    amount: (v) =>
      displayAsTokenValue
        ? Number(v).toLocaleString(undefined, showDust ? DUST_FORMAT : TOKEN_FORMAT)
        : (Number(v) * price$).toLocaleString(undefined, USD_FORMAT),
    string: (v) => v.toString(),
  };

  const displayValue = formatMap[format](value);
  return <Box>{displayValue}</Box>;
};
