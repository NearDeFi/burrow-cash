import { TokenCell, Cell, Label } from "../../components/Table/common/cells";

export const columns = [
  {
    label: "Name",
    dataKey: "name",
    Cell: TokenCell,
  },
  {
    label: <Label name="Rewards" title="Rewards / Day" />,
    dataKey: "brrrSupply",
    align: "right",
    sortLabelStyle: { minWidth: [90, 90, "auto"] },
    Cell: ({ rowData }) => (
      <Cell
        value={rowData?.brrrSupply}
        rowData={rowData}
        format="reward"
        rewardLayout="horizontal"
        rewards={rowData.depositRewards}
      />
    ),
  },
  {
    label: <Label name="APY" title="Deposit APY" />,
    dataKey: "supplyApy",
    align: "right",
    sortLabelStyle: { minWidth: [70, 70, "auto"] },
    Cell: ({ rowData }) => <Cell value={rowData?.supplyApy} rowData={rowData} format="apy" />,
  },
  {
    label: <Label name="Deposits" title="Total Deposits" />,
    dataKey: "totalSupply",
    sortLabelStyle: { minWidth: [90, 90, "auto"] },
    Cell: ({ rowData }) => <Cell value={rowData?.totalSupply} rowData={rowData} format="amount" />,
    align: "right",
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
    label: <Label name="Deposited" title="Your deposits" />,
    dataKey: "deposited",
    Cell: ({ rowData }) => <Cell value={rowData.deposited} rowData={rowData} format="amount" />,
    align: "right",
  },
  {
    label: <Label name="USD Value" title="Token amount as USD Value" />,
    dataKey: "totalSupplyMoney",
    Cell: ({ rowData }) => <Cell value={rowData.totalSupplyMoney} rowData={rowData} format="usd" />,
    align: "right",
  },
];
