import { TokenCell, Cell, BRRRLabel, formatBRRRAmount } from "../../components/Table/common/cells";

export const columns = [
  {
    label: "Name",
    dataKey: "name",
    Cell: TokenCell,
  },
  {
    label: <BRRRLabel title="BRRR Rewards / Day" />,
    dataKey: "brrr",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell
        value={`${formatBRRRAmount(rowData?.brrrSupply)} / Day`}
        rowData={rowData}
        format="string"
      />
    ),
  },
  {
    label: "Deposit APY",
    dataKey: "apy",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData?.supplyApy} rowData={rowData} format="apy" />,
  },
  {
    label: "BRR per 1K on Supply",
    dataKey: "supply-apy-efficiency",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell value={rowData?.brrrSupplyEfficiency} rowData={rowData} format="string" />
    ),
  },
  {
    label: "Borrow APY",
    dataKey: "borrow-apy",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData?.borrowApy} rowData={rowData} format="apy" />,
  },
  {
    label: "BRR per 1K on Borrow",
    dataKey: "borrow-apy-efficiency",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell value={rowData?.brrrBorrowEfficiency} rowData={rowData} format="string" />
    ),
  },
  {
    label: "BRR per 1K on Supply + Borrow",
    dataKey: "borrow-supply-apy-efficiency",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell value={rowData?.brrrEfficiency} rowData={rowData} format="string" />
    ),
  },
  {
    label: "BRR per 1K on Supply + Borrow / APY Diff",
    dataKey: "borrow-apy-diff-efficiency",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell
        bgcolor="lightgreen"
        value={rowData?.brrrEfficiencyWithAPY}
        rowData={rowData}
        format="string"
      />
    ),
  },
  {
    label: "Total Deposit",
    dataKey: "deposit",
    Cell: ({ rowData }) => <Cell value={rowData?.totalSupply} rowData={rowData} format="amount" />,
    align: "right",
  },
  {
    label: "Total Deposit, USD",
    dataKey: "deposit-usd",
    Cell: ({ rowData }) => (
      <Cell value={rowData?.totalLiquidityMoney} rowData={rowData} format="amount" />
    ),
    align: "right",
  },
  {
    label: "Available Liquidity",
    dataKey: "liquidity",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell value={rowData?.availableLiquidity} rowData={rowData} format="amount" />
    ),
  },
  {
    label: "Borrowed Liquidity USD",
    dataKey: "liquidity-usd",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell value={rowData?.borrowedLiquidityMoney} rowData={rowData} format="amount" />
    ),
  },
  {
    label: "Your Deposit",
    dataKey: "yourdeposit",
    Cell: ({ rowData }) => (
      <Cell
        value={rowData ? rowData.supplied + rowData.collateral : undefined}
        rowData={rowData}
        format="amount"
      />
    ),
    align: "right",
  },
];
