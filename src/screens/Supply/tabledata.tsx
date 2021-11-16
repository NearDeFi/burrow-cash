import { TokenCell, AmountSupplied, APYCell, TotalSupplyCell, WalletBalanceCell } from "./cells";
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

export const amountSuppliedColumn = (portfolio) => ({
  label: "Amount Supplied",
  dataKey: "supplied",
  align: "right",
  Cell: (props) => <AmountSupplied {...props} portfolio={portfolio} />,
});

export const walletColumn = (balances) => ({
  label: "Wallet",
  dataKey: "wallet",
  Cell: (props) => <WalletBalanceCell {...props} balances={balances} />,
  align: "right",
});
