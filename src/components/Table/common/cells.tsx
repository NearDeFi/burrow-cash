import { Box } from "@mui/material";

import TokenIcon from "../../TokenIcon";
import { USD_FORMAT } from "../../../store";

export const TokenCell = ({ rowData }) => {
  const { symbol, price } = rowData;
  return (
    <Box display="flex">
      <Box>
        <TokenIcon icon={rowData?.icon} />
      </Box>
      <Box px="1rem">
        <Box>{symbol}</Box>
        <Box>{price.toLocaleString(undefined, USD_FORMAT) || "$-.-"}</Box>
      </Box>
    </Box>
  );
};

export const Cell = ({ value }: { value: string }) => {
  return <Box>{value}</Box>;
};
