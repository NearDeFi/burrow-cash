import { Box, Alert } from "@mui/material";

import { useState } from "react";
import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, PageTitle, TotalBRRR } from "../../components";
import { columns as defaultColumns } from "./tabledata";
import Table from "../../components/Table";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getTotalBalance, getAvailableAssets } from "../../redux/assetsSelectors";
import { getTotalAccountBalance, getAccountId, getNetAPY } from "../../redux/accountSelectors";
import { showModal } from "../../redux/appSlice";
import { isBeta } from "../../store";
import Input from "../../components/Input";

const Deposit = () => {
  const [brrPrice, setBrrPrice] = useState(0.3);
  const dispatch = useAppDispatch();
  const totalSupplyBalance = useAppSelector(getTotalBalance("supplied"));
  const yourSupplyBalance = useAppSelector(getTotalAccountBalance("supplied"));
  const accountId = useAppSelector(getAccountId);
  const rows = useAppSelector(getAvailableAssets("supply"))
    .map((asset) => {
      asset.reward = (parseFloat(asset.brrrEfficiency) * brrPrice * 365) / 10;
      asset.brrApy = (
        (parseFloat(asset.brrrEfficiency) * brrPrice * 365 + asset.supplyApy - asset.borrowApy) /
        10
      ).toFixed(2);
      asset.maxFarmApy = asset.maxFold * parseFloat(asset.brrApy);
      return asset;
    })
    .sort(function (a, b) {
      return Number(b.maxFarmApy) - Number(a.maxFarmApy);
    });
  const netAPY = useAppSelector(getNetAPY);

  const columns = !accountId
    ? [...defaultColumns.filter((col) => col.dataKey !== "supplied")]
    : defaultColumns;

  const handleOnRowClick = ({ tokenId }) => {
    dispatch(showModal({ action: "Supply", tokenId, amount: 0 }));
  };

  const brrPriceInputChange = (event) => {
    setBrrPrice(parseFloat(event.target.value));
  };

  return (
    <Box pb="2.5rem">
      <PageTitle first="BRRR" second="Farming Rewards" />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "24px", display: "inline-block" }}>
          <span>BRRR Price: $</span>
          <input
            style={{ fontSize: "24px", width: "80px" }}
            type="number"
            value={brrPrice}
            step="0.01"
            onChange={brrPriceInputChange}
          />
        </div>
      </div>
      <Table rows={rows} columns={columns} onRowClick={handleOnRowClick} />
    </Box>
  );
};

export default Deposit;
