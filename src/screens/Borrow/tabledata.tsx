import { TokenCell, Cell, BRRRLabel } from "../../components/Table/common/cells";

export const columns = [
  {
    label: "Name",
    dataKey: "name",
    Cell: TokenCell,
  },
  {
    label: <BRRRLabel title="BRRR Rewards / Day" />,
    dataKey: "brrrBorrow",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell
        value={rowData?.brrrBorrow}
        rowData={rowData}
        format="reward"
        extraRewards={rowData.extraBorrowRewards}
      />
    ),
  },
  {
    label: "Borrow APY",
    dataKey: "borrowApy",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData?.borrowApy} rowData={rowData} format="apy" />,
  },
  {
    label: "Available Liquidity",
    dataKey: "availableLiquidity",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell value={rowData?.availableLiquidity} rowData={rowData} format="amount" />
    ),
  },
  {
    label: "Collateral Factor",
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
