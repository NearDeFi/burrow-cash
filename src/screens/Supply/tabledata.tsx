import { TokenCell, BoostCell, APYCell, TotalSupplyCell, WalletBalanceCell } from "./cells";

export const columns = [
	{
		label: "Name",
		dataKey: "name",
		Cell: TokenCell,
	},
	{
		label: "BRRR Boost",
		dataKey: "boost",
		align: "right",
		Cell: BoostCell,
	},
	{
		label: "APY",
		dataKey: "apy",
		align: "right",
		Cell: APYCell,
	},
	{
		label: "Total Supply",
		dataKey: "supply",
		Cell: TotalSupplyCell,
		align: "right",
	},
];

export const amountSuppliedColumn = (balances) => ({
	label: "Wallet",
	dataKey: "balance",
	Cell: (props) => <WalletBalanceCell {...props} balances={balances} />,
	align: "right",
});
