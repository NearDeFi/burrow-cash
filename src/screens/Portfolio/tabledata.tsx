import { TokenCell, Cell, Label } from "../../components/Table/common/cells";
import { WithdrawCell, RepayCell, AdjustCell } from "./cells";

export const suppliedColumns = [
  {
    label: "Name",
    dataKey: "symbol",
    Cell: TokenCell,
  },
  {
    label: <Label name="Rewards" title="Rewards / day" />,
    dataKey: "dailyBRRRewards",
    align: "right",
    sortLabelStyle: { minWidth: [90, 90, "auto"] },
    Cell: ({ rowData }) => (
      <Cell
        value={rowData.dailyBRRRewards}
        rowData={rowData}
        rewards={rowData.rewards}
        format="reward"
      />
    ),
  },
  {
    label: <Label name="APY" title="Deposit APY" />,
    dataKey: "apy",
    align: "right",
    sortLabelStyle: { minWidth: [70, 70, "auto"] },
    Cell: ({ rowData }) => <Cell value={rowData.apy} rowData={rowData} format="apy" />,
  },
  {
    label: <Label name="Collateral" title="Collateral" />,
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
    label: <Label name="Deposited" title="Your deposits" />,
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
    label: "Name",
    dataKey: "symbol",
    Cell: TokenCell,
  },
  {
    label: <Label name="Rewards" title="Rewards / day" />,
    dataKey: "dailyBRRRewards",
    align: "right",
    sortLabelStyle: { minWidth: [90, 90, "auto"] },
    Cell: ({ rowData }) => (
      <Cell
        value={rowData.dailyBRRRewards}
        rewards={rowData.rewards}
        rowData={rowData}
        format="reward"
      />
    ),
  },
  {
    label: <Label name="APY" title="Borrow APY" />,
    dataKey: "borrowApy",
    align: "right",
    sortLabelStyle: { minWidth: [70, 70, "auto"] },
    Cell: ({ rowData }) => <Cell value={rowData.borrowApy} rowData={rowData} format="apy" />,
  },
  {
    label: <Label name="Borrowed" title="Your borrows" />,
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
