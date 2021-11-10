import {
	TokenCell,
	SupplyAPYCell,
	CollateralCell,
	SuppliedCell,
	WithdrawCell,
	BorrowSuppplyAPYCell,
	BorrowAPYCell,
	BorrowedCell,
	RepayCell,
} from "./cells";

export const suppliedColumns = [
	{
		label: "Name",
		dataKey: "name",
		Cell: TokenCell,
	},
	{
		label: "APY",
		dataKey: "apy",
		align: "right",
		Cell: SupplyAPYCell,
	},
	{
		label: "Collateral",
		dataKey: "collateralSum",
		align: "right",
		Cell: CollateralCell,
	},
	{
		label: "Supplied",
		dataKey: "balance",
		align: "right",
		Cell: SuppliedCell,
	},
	{
		dataKey: "withdraw",
		align: "right",
		Cell: WithdrawCell,
	},
];

export const borrowColumns = [
	{
		label: "Name",
		dataKey: "name",
		Cell: TokenCell,
	},
	{
		label: "APY",
		dataKey: "apy",
		align: "right",
		Cell: BorrowSuppplyAPYCell,
	},
	{
		label: "Borrow APY",
		dataKey: "borrowAPY",
		align: "right",
		Cell: BorrowAPYCell,
	},
	{
		label: "Borrowed",
		dataKey: "shares",
		align: "right",
		Cell: BorrowedCell,
	},
	{
		dataKey: "repay",
		align: "right",
		Cell: RepayCell,
	},
];
