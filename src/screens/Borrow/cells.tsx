import { Box } from "@mui/material";

import { PERCENT_DIGITS, TOKEN_FORMAT, USD_FORMAT } from "../../store/constants";
import { IAsset } from "../../interfaces/account";
import { IAssetDetailed } from "../../interfaces/asset";
import { toUsd } from "../../store";
import TokenIcon from "../../components/TokenIcon";

interface CellProps {
	rowData: IAsset & IAssetDetailed;
}

export const TokenCell = ({ rowData }) => {
	const { symbol, price } = rowData;
	return (
		<Box display="flex">
			<Box>
				<TokenIcon icon={rowData?.icon} />
			</Box>
			<Box px="1rem">
				<Box>{symbol}</Box>
				<Box>{price ? `${rowData.price.usd.toLocaleString(undefined, USD_FORMAT)}` : "$-.-"}</Box>
			</Box>
		</Box>
	);
};

export const APYCell = ({ rowData }: CellProps) => {
	return <Box>{Number(rowData.borrow_apr).toFixed(PERCENT_DIGITS)}%</Box>;
};

export const LiquiditylCell = ({ rowData }) => {
	return (
		<Box>
			{rowData.price?.usd
				? toUsd(rowData.borrowed.balance, rowData).toLocaleString(undefined, USD_FORMAT)
				: "$-.-"}
		</Box>
	);
};

export const CollateralFactorCell = () => {
	return <Box>{(0).toFixed(PERCENT_DIGITS)}%</Box>;
};

export const AmountBorrowedCell = ({ rowData, portfolio }) => {
	return (
		<Box>
			{Number(
				portfolio?.borrowed.find((b) => b.token_id === rowData.token_id)?.balance || 0,
			).toLocaleString(undefined, TOKEN_FORMAT)}
		</Box>
	);
};
