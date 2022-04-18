import { TokenCell, Cell, BRRRLabel } from "../../components/Table/common/cells";

export const columns = [
  {
    label: "Name",
    dataKey: "name",
    Cell: TokenCell,
  },
  {
    label: <BRRRLabel title="BRRR Rewards / Day" />,
    dataKey: "brrrSupply",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell
        value={rowData?.brrrSupply}
        rowData={rowData}
        format="reward"
        extraRewards={rowData.extraDepositRewards}
      />
    ),
  },
  {
    label: "APY",
    dataKey: "supplyApy",
    align: "right",
    Cell: ({ rowData }) => <Cell value={rowData?.supplyApy} rowData={rowData} format="apy" />,
  },
  {
    label: "Total Deposit",
    dataKey: "totalSupply",
    Cell: ({ rowData }) => <Cell value={rowData?.totalSupply} rowData={rowData} format="amount" />,
    align: "right",
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
    label: "Your Deposit",
    dataKey: "deposited",
    Cell: ({ rowData }) => <Cell value={rowData.deposited} rowData={rowData} format="amount" />,
    align: "right",
  },
  {
    label: "USD Value",
    dataKey: "totalSupplyMoney",
    Cell: ({ rowData }) => <Cell value={rowData.totalSupplyMoney} rowData={rowData} format="usd" />,
    align: "right",
  },
];
