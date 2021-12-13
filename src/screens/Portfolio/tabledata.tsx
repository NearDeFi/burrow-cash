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
    Cell: ({ rowData }) => <Cell value={rowData.apy} rowData={rowData} />,
  },
  {
    label: "Collateral",
    dataKey: "collateralSum",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.collateral} rowData={rowData} />,
  },
  {
    label: "Supplied",
    dataKey: "balance",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.supplied} rowData={rowData} />,
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
    label: "APY",
    dataKey: "apy",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.supplyApy} rowData={rowData} />,
  },
  {
    label: "Borrow APY",
    dataKey: "borrowAPY",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.borrowApy} rowData={rowData} />,
  },
  {
    label: "Borrowed",
    dataKey: "shares",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.borrowed} rowData={rowData} />,
  },
  {
    dataKey: "repay",
    align: "right",
    Cell: RepayCell,
  },
];
