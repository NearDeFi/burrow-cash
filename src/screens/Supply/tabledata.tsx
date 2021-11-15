import { TokenCell, APYCell, TotalSupplyCell, WalletBalanceCell } from "./cells";
// "BoostCell" removed from destructured object "./cells" import

export const columns = [
  {
    label: "Name",
    dataKey: "name",
    Cell: TokenCell,
  },

  /** *************** Remove "BRRR Boost" and add "Amount Supplied" to Supply page #112 
  {
    label: "BRRR Boost",
    dataKey: "boost",
    align: "right",
    Cell: BoostCell,
  },
  ******************** */

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
