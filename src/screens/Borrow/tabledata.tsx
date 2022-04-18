import { TokenCell, Cell, BRRRLabel, formatBRRRAmount } from "../../components/Table/common/cells";

export const columns = [
  {
    label: "Asset",
    dataKey: "name",
    Cell: TokenCell,
  },
  {
    label: <BRRRLabel title="BRRR Rewards / Day" />,
    dataKey: "brrrBorrow",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell
        value={`${formatBRRRAmount(rowData?.brrrBorrow)}`}
        rowData={rowData}
        format="string"
        extraRewards={rowData.extraBorrowRewards}
      />
    ),
  },
  {
    label: "(APY)",
    dataKey: "borrowApy",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData?.borrowApy} rowData={rowData} format="apy" />,
  },
  {
    label: "Liquidity",
    dataKey: "availableLiquidity",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell value={rowData?.availableLiquidity} rowData={rowData} format="amount" />
    ),
  },
  {
    label: "LTV",
    dataKey: "collateralFactor",
    Cell: ({ rowData }) => (
      <Cell value={rowData?.collateralFactor} rowData={rowData} format="string" />
    ),
    align: "right",
  },
  {
    label: "Amount Borrowed",
    dataKey: "borrowed",
    Cell: ({ rowData }) => <Cell value={rowData?.borrowed} rowData={rowData} format="amount" />,
    align: "right",
  },
];
