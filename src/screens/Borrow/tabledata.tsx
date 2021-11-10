import {
	TokenCell,
	APYCell,
	LiquiditylCell,
	CollateralFactorCell,
	AmountBorrowedCell,
} from "./cells";

export const columns = [
	{
		label: "Name",
		dataKey: "name",
		Cell: TokenCell,
	},
	{
		label: "Borrow APY",
		dataKey: "borrowAPY",
		align: "right",
		Cell: APYCell,
	},
	{
		label: "Liquidity",
		dataKey: "liquidity",
		align: "right",
		Cell: LiquiditylCell,
	},
	{
		label: "Collateral Factor",
		dataKey: "collateralFactor",
		Cell: CollateralFactorCell,
		align: "right",
	},
];

export const amountBorrowedColumn = (portfolio) => ({
	width: 100,
	label: "Amount Borrowed",
	dataKey: "borrowed",
	Cell: (props) => <AmountBorrowedCell {...props} portfolio={portfolio} />,
	align: "right",
});
