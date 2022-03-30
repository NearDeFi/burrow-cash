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
    label: "APY",
    dataKey: "apy",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData?.supplyApy} rowData={rowData} format="apy" />,
  },
  {
    label: "Total Deposit",
    dataKey: "deposit",
    Cell: ({ rowData }) => <Cell value={rowData?.totalSupply} rowData={rowData} format="amount" />,
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
