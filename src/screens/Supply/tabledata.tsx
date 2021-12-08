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
    Cell: ({ rowData }) => <Cell value={rowData.supplyApy} />,
  },
  {
    label: "Total Supply",
    dataKey: "supply",
    Cell: ({ rowData }) => <Cell value={rowData.totalSupply} />,
    align: "right",
  },
  {
    label: "Amount Supplied",
    dataKey: "supplied",
    Cell: ({ rowData }) => <Cell value={rowData.supplied} />,
    align: "right",
  },
];
