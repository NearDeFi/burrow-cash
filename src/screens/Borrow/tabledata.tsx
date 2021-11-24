import {
  TokenCell,
  APYCell,
  LiquidityCell,
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
    label: "Available Liquidity",
    dataKey: "liquidity",
    align: "right",
    Cell: LiquidityCell,
  },
  {
    label: "Collateral Factor",
    dataKey: "collateralFactor",
    Cell: CollateralFactorCell,
    align: "right",
  },
];

export const amountBorrowedColumn = (portfolio) => ({
  label: "Amount Borrowed",
  dataKey: "borrowed",
  Cell: (props) => <AmountBorrowedCell {...props} portfolio={portfolio} />,
  align: "right",
});
