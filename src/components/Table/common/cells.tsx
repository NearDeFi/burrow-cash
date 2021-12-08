import { Box } from "@mui/material";

import TokenIcon from "../../TokenIcon";

export const TokenCell = ({ rowData }) => {
  const { symbol, price } = rowData;
  return (
    <Box display="flex">
      <Box>
        <TokenIcon icon={rowData?.icon} />
      </Box>
      <Box px="1rem">
        <Box>{symbol}</Box>
        <Box>{price || "$-.-"}</Box>
      </Box>
    </Box>
  );
};

export const Cell = ({ value }: { value: string }) => {
  return <Box>{value}</Box>;
};
