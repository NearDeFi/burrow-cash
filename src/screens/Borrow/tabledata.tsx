import { TokenCell, Cell } from "../../components/Table/common/cells";

export const columns = [
  {
    label: "Name",
    dataKey: "name",
    Cell: TokenCell,
  },
  {
    label: "Borrow APY",
    dataKey: "borrowAPY",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.borrowApy} />,
  },
  {
    label: "Available Liquidity",
    dataKey: "liquidity",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.availableLiquidity} />,
  },
  {
    label: "Collateral Factor",
    dataKey: "collateralFactor",
    Cell: ({ rowData }) => <Cell value={rowData.collateralFactor} />,
    align: "right",
  },
  {
    label: "Amount Borrowed",
    dataKey: "borrowed",
    Cell: ({ rowData }) => <Cell value={rowData.borrowed} />,
    align: "right",
  },
];
