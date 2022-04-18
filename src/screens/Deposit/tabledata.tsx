import { TokenCell, Cell, BRRRLabel, formatBRRRAmount } from "../../components/Table/common/cells";

export const columns = [
  {
    label: "Asset",
    dataKey: "name",
    Cell: TokenCell,
  },
  {
    label: <BRRRLabel title="BRRR Rewards / Day" />,
    dataKey: "brrrSupply",
    align: "right",
    Cell: ({ rowData }) => (
      <Cell
        value={`${formatBRRRAmount(rowData?.brrrSupply)}`}
        rowData={rowData}
        format="string"
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
    label: "Deposits",
    dataKey: "totalSupply",
    Cell: ({ rowData }) => <Cell value={rowData?.totalSupply} rowData={rowData} format="amount" />,
    align: "right",
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
    label: "Deposited",
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
