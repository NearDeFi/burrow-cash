import { Box } from "@mui/material";

import { PERCENT_DIGITS, TOKEN_FORMAT, USD_FORMAT } from "../../store/constants";
import { IAssetDetailed, IMetadata, IAsset } from "../../interfaces";
import { getTotalSupply, toUsd } from "../../store";
import { TokenCell } from "../../components/Table/common/cells";

interface CellProps {
  rowData: IAsset & IAssetDetailed & IMetadata;
}

export { TokenCell };

export const BoostCell = () => {
  return <Box>xxx</Box>;
};

export const APYCell = ({ rowData }: CellProps) => {
  return <Box>{(Number(rowData.supply_apr) * 100).toFixed(PERCENT_DIGITS)}%</Box>;
};

export const TotalSupplyCell = ({ rowData }: CellProps) => {
  return (
    <Box>
      {rowData.price?.usd
        ? toUsd(getTotalSupply(rowData), rowData).toLocaleString(undefined, USD_FORMAT)
        : "$-.-"}
    </Box>
  );
};

export const AmountSupplied = ({ rowData, portfolio }: CellProps & { portfolio: any }) => {
  const balance = portfolio?.supplied.find((b) => b.token_id === rowData.token_id)?.balance || 0;
  return <Box>{Number(balance).toLocaleString(undefined, TOKEN_FORMAT)}</Box>;
};
