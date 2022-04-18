import { TokenCell, Cell, BRRRLabel } from "../../components/Table/common/cells";
import { WithdrawCell, RepayCell, AdjustCell } from "./cells";

export const suppliedColumns = [
  {
    label: "Asset",
    dataKey: "symbol",
    Cell: TokenCell,
  },
  {
    label: <BRRRLabel title="BRRR rewards / day" />,
    dataKey: "dailyBRRRewards",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell value={rowData.dailyBRRRewards} rowData={rowData} format="reward" />
    ),
  },
  {
    label: "APY",
    dataKey: "apy",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.apy} rowData={rowData} format="apy" />,
  },
  {
    label: "Collateral",
    dataKey: "collateral",
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
    label: "Deposited",
    dataKey: "supplied",
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
    label: "Asset",
    dataKey: "symbol",
    Cell: TokenCell,
  },
  {
    label: <BRRRLabel title="BRRR rewards / day" />,
    dataKey: "dailyBRRRewards",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell value={rowData.dailyBRRRewards} rowData={rowData} format="reward" />
    ),
  },
  {
    label: "Borrow APY",
    dataKey: "borrowApy",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.borrowApy} rowData={rowData} format="apy" />,
  },
  {
    label: "Borrowed",
    dataKey: "borrowed",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.borrowed} rowData={rowData} format="amount" />,
  },
  {
    dataKey: "repay",
    align: "right",
    Cell: RepayCell,
  },
];
