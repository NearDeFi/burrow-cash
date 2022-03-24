import { TokenCell, Cell, BRRRLabel } from "../../components/Table/common/cells";
import { TOKEN_FORMAT } from "../../store";

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
        value={`${rowData?.brrrBorrow?.toLocaleString(undefined, TOKEN_FORMAT)} / Day`}
        rowData={rowData}
        format="string"
      />
    ),
  },
  {
    label: "Borrow APY",
    dataKey: "borrowAPY",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData?.borrowApy} rowData={rowData} format="apy" />,
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
