import { TokenCell, Cell } from "../../components/Table/common/cells";

export const columns = [
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
    label: "Total Supply",
    dataKey: "supply",
    Cell: ({ rowData }) => <Cell value={rowData.totalSupply} rowData={rowData} format />,
    align: "right",
  },
  {
    label: "Amount Supplied",
    dataKey: "supplied",
    Cell: ({ rowData }) => <Cell value={rowData.supplied} rowData={rowData} format />,
    align: "right",
  },
];
