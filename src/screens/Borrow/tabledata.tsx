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
    Cell: ({ rowData }) => <Cell value={rowData.borrowApy} rowData={rowData} />,
  },
  {
    label: "Available Liquidity",
    dataKey: "liquidity",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData.availableLiquidity} rowData={rowData} format />,
  },
  {
    label: "Collateral Factor",
    dataKey: "collateralFactor",
    Cell: ({ rowData }) => <Cell value={rowData.collateralFactor} rowData={rowData} />,
    align: "right",
  },
  {
    label: "Amount Borrowed",
    dataKey: "borrowed",
    Cell: ({ rowData }) => <Cell value={rowData.borrowed} rowData={rowData} format />,
    align: "right",
  },
];
