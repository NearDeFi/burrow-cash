import { Cell } from "../../components/Table/common/cells";
import TokenCell from "../../components/Table/common/token-cell";
import Label from "../../components/Table/common/label";

export const columns = [
  {
    label: "Asset",
    dataKey: "asset",
    Cell: TokenCell,
  },
  {
    label: <Label name="APY" title="Deposit APY" />,
    dataKey: "supplyApy",
    align: "right",
    sortLabelStyle: { minWidth: [70, 70, "auto"] },
    cellStyle: { pl: 0, pr: "2rem" },
    Cell: ({ rowData }) => (
      <Cell
        value={rowData?.supplyApy}
        rowData={rowData}
        format="apy"
        rewards={rowData.depositRewards}
        page="deposit"
      />
    ),
  },
  {
    label: <Label name="Rewards" title="Estimated Rewards / Day" />,
    dataKey: "rewards",
    align: "left",
    sortLabelStyle: { minWidth: [90, 90, "auto"] },
    cellStyle: { pr: 0 },
    Cell: ({ rowData }) => (
      <Cell
        value={rowData?.brrrSupply}
        rowData={rowData}
        format="reward"
        rewardLayout="horizontal"
        rewards={rowData.depositRewards}
        page="deposit"
      />
    ),
  },
  {
    label: <Label name="Deposits" title="Total Deposits" />,
    dataKey: "totalSupply",
    sortLabelStyle: { minWidth: [90, 90, "auto"] },
    cellStyle: { pl: 0 },
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
