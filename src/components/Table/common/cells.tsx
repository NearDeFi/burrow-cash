import { Box } from "@mui/material";

import TokenIcon from "../../TokenIcon";
import { USD_FORMAT, TOKEN_FORMAT } from "../../../store";
import type { UIAsset } from "../../../interfaces";

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

export const Cell = ({
  value,
  rowData,
  format,
}: {
  value: number;
  rowData: UIAsset;
  format?: boolean;
}) => {
  const { price = 0 } = rowData;
  const displayAsToken = false;
  const displayValue = format
    ? displayAsToken
      ? value.toLocaleString(undefined, TOKEN_FORMAT)
      : (value * price).toLocaleString(undefined, USD_FORMAT)
    : value.toLocaleString(undefined, TOKEN_FORMAT);
  return <Box>{displayValue}</Box>;
};
