import { TokenCell, Cell, Label } from "../../components/Table/common/cells";

export const columns = [
  {
    label: "Name",
    dataKey: "name",
    Cell: TokenCell,
  },
  {
    label: <Label name="Rewards" title="Rewards / Day" />,
    dataKey: "brrrBorrow",
    align: "right",
    sortLabelStyle: { minWidth: [90, 90, "auto"] },
    Cell: ({ rowData }) => (
      <Cell
        value={rowData?.brrrBorrow}
        rowData={rowData}
        format="reward"
        rewards={rowData.borrowRewards}
      />
    ),
  },
  {
    label: <Label name="APY" title="Borrow APY" />,
    dataKey: "borrowApy",
    align: "right",
    sortLabelStyle: { minWidth: [70, 70, "auto"] },
    Cell: ({ rowData }) => <Cell value={rowData?.borrowApy} rowData={rowData} format="apy" />,
  },
  {
    label: <Label name="Liquidity" title="Available Liquidity" />,
    dataKey: "availableLiquidity",
    align: "right",
    sortLabelStyle: { minWidth: [90, 90, "auto"] },
    Cell: ({ rowData }) => (
      <Cell value={rowData?.availableLiquidity} rowData={rowData} format="amount" />
    ),
  },
  {
    label: <Label name="C.F." title="Collateral Factor" />,
    dataKey: "collateralFactor",
    sortLabelStyle: { minWidth: [70, 70, "auto"] },
    Cell: ({ rowData }) => (
      <Cell value={rowData?.collateralFactor} rowData={rowData} format="string" />
    ),
    align: "right",
  },
  {
    label: <Label name="Borrowed" title="Your borrows" />,
    dataKey: "borrowed",
    Cell: ({ rowData }) => <Cell value={rowData?.borrowed} rowData={rowData} format="amount" />,
    align: "right",
  },
];
