import { TokenCell, Cell, BRRRLabel } from "../../components/Table/common/cells";
import { WithdrawCell, RepayCell, AdjustCell } from "./cells";
import { TOKEN_FORMAT } from "../../store";

export const suppliedColumns = [
  {
    label: "Name",
    dataKey: "name",
    Cell: TokenCell,
  },
  {
    label: <BRRRLabel title="BRRR rewards / day" />,
    dataKey: "brrr",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell
        value={rowData?.dailyBRRRewards?.toLocaleString(undefined, TOKEN_FORMAT)}
        rowData={rowData}
        format="amount"
      />
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
    label: "Deposited",
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
    label: <BRRRLabel title="BRRR rewards / day" />,
    dataKey: "brrr",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell
        value={rowData?.dailyBRRRewards?.toLocaleString(undefined, TOKEN_FORMAT)}
        rowData={rowData}
        format="amount"
      />
    ),
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
