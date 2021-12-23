import { TokenCell, Cell } from "../../components/Table/common/cells";
import { WithdrawCell, RepayCell, AdjustCell } from "./cells";

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
    Cell: ({ rowData }) => <Cell value={rowData.apy} rowData={rowData} format="apy" />,
  },
  {
    label: "Collateral",
    dataKey: "collateralSum",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell
        value={rowData.collateral}
        rowData={rowData}
        format="amount"
        tooltip={`${((rowData.collateral / rowData.supplied) * 100).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}%`}
      />
    ),
  },
  {
    label: "Supplied",
    dataKey: "balance",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.supplied} rowData={rowData} format="amount" />,
  },
  {
    dataKey: "withdraw",
    align: "right",
    Cell: WithdrawCell,
  },
  {
    dataKey: "adjust",
    align: "right",
    Cell: AdjustCell,
  },
];

export const borrowedColumns = [
  {
    label: "Name",
    dataKey: "name",
    Cell: TokenCell,
  },
  {
    label: "Borrow APY",
    dataKey: "borrowAPY",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.borrowApy} rowData={rowData} format="apy" />,
  },
  {
    label: "Borrowed",
    dataKey: "shares",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.borrowed} rowData={rowData} format="amount" />,
  },
  {
    dataKey: "repay",
    align: "right",
    Cell: RepayCell,
  },
];
