import { Box, Button } from "@mui/material";

import { PERCENT_DIGITS, TOKEN_FORMAT } from "../../store/constants";
import { IAsset } from "../../interfaces/account";
import { IAssetDetailed } from "../../interfaces/asset";
import { TokenCell } from "../../components/Table/common/cells";

interface CellProps {
	rowData: IAsset & IAssetDetailed;
}

export { TokenCell };

export const SupplyAPYCell = ({ rowData }: CellProps) => {
	return <Box>{Number(rowData.apr).toFixed(PERCENT_DIGITS)}%</Box>;
};

export const CollateralCell = ({ rowData }) => {
	return (
		<Box>
			{rowData.collateral &&
				Number(rowData.collateral.balance).toLocaleString(undefined, TOKEN_FORMAT)}
		</Box>
	);
};

export const SuppliedCell = ({ rowData }: CellProps) => {
	return <Box>{Number(rowData.balance).toLocaleString(undefined, TOKEN_FORMAT)}</Box>;
};

export const WithdrawCell = ({ rowData }: CellProps) => {
	console.info(rowData);
	return (
		<Box>
			<Button size="small" variant="contained">
				Withdraw
			</Button>
		</Box>
	);
};

export const BorrowSuppplyAPYCell = ({ rowData }: CellProps) => {
	return <Box>{Number(rowData.supply_apr).toFixed(PERCENT_DIGITS)}%</Box>;
};

export const BorrowAPYCell = ({ rowData }: CellProps) => {
	return <Box>{Number(rowData.borrow_apr).toFixed(PERCENT_DIGITS)}%</Box>;
};

export const BorrowedCell = ({ rowData }: CellProps) => {
	return <Box>{Number(rowData.balance).toLocaleString(undefined, TOKEN_FORMAT)}</Box>;
};

export const RepayCell = ({ rowData }: CellProps) => {
	console.info(rowData);
	return (
		<Box>
			<Button size="small" variant="contained">
				Repay
			</Button>
		</Box>
	);
};
