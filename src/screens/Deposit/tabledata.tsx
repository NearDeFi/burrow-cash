import {
  TokenCell,
  Cell,
  BRRRLabel,
  formatBRRRAmount,
  LabelWithHint,
} from "../../components/Table/common/cells";

export const columns = [
  {
    label: "Name",
    dataKey: "name",
    Cell: TokenCell,
  },
  {
    label: <BRRRLabel title="BRRR Rewards Daily : Supply / Burrow" />,
    dataKey: "brrr",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell
        value={`${formatBRRRAmount(rowData?.brrrSupply)}/${formatBRRRAmount(rowData?.brrrBorrow)}`}
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
    label: "BRRR per $1000 on Supply",
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
    label: "BRRR per $1000 on Borrow",
    dataKey: "borrow-apy-efficiency",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell value={rowData?.brrrBorrowEfficiency} rowData={rowData} format="string" />
    ),
  },
  {
    label: "BRRR per $1000 on Supply + Borrow",
    dataKey: "borrow-supply-apy-efficiency",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell value={rowData?.brrrEfficiency} rowData={rowData} format="string" />
    ),
  },
  {
    label: (
      <LabelWithHint
        hint="BRRR Farming APY + Deposit APY - Borrow APY"
        title="Farming APY per loop"
      />
    ),
    dataKey: "brrr-apy",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell bgcolor="white" value={`${rowData?.brrApy}%`} rowData={rowData} format="string" />
    ),
  },
  {
    label: (
      <LabelWithHint
        hint="Max single asset folds available based on collateral factor"
        title="Max Folds"
      />
    ),
    dataKey: "brrr-max-fold-apy",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell bgcolor="white" value={rowData?.maxFold.toFixed(2)} rowData={rowData} format="string" />
    ),
  },
  {
    label: <LabelWithHint hint="Farming APY with max folds" title="Max Folds APY" />,
    dataKey: "max-fold-apy",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell
        bgcolor="lightgreen"
        value={`${rowData?.maxFarmApy.toFixed(2)}%`}
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
