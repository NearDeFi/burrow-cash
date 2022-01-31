import { useState, useMemo } from "react";
import { Box, Typography, Switch } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { nearTokenId } from "../../utils";
import { toggleUseAsCollateral } from "../../redux/appSlice";
import { actionMapTitle, getModalData } from "./utils";
import { repay } from "../../store/actions/repay";
import { supply } from "../../store/actions/supply";
import { deposit } from "../../store/actions/deposit";
import { borrow } from "../../store/actions/borrow";
import { withdraw } from "../../store/actions/withdraw";
import { removeCollateral } from "../../store/actions/removeCollateral";
import { addCollateral } from "../../store/actions/addCollateral";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  getSelectedValues,
  getAssetData,
  getRepayMaxAmount,
  getWithdrawMaxAmount,
} from "../../redux/appSelectors";

export default function Action({ maxBorrowAmount, healthFactor, displaySymbol }) {
  const [loading, setLoading] = useState(false);
  const { amount, useAsCollateral, isMax } = useAppSelector(getSelectedValues);
  const dispatch = useAppDispatch();
  const asset = useAppSelector(getAssetData);
  const { action = "Deposit", tokenId } = asset;
  const repayMaxAmount = useAppSelector(getRepayMaxAmount(tokenId));
  const withdrawMaxAmount = useAppSelector(getWithdrawMaxAmount(tokenId));

  const { available, canUseAsCollateral, extraDecimals, collateral, supplied } = getModalData({
    ...asset,
    maxBorrowAmount,
    healthFactor,
    amount,
  });

  const handleSwitchToggle = (event) => {
    dispatch(toggleUseAsCollateral({ useAsCollateral: event.target.checked }));
  };

  const handleActionButtonClick = async () => {
    setLoading(true);
    switch (action) {
      case "Supply":
        if (tokenId === nearTokenId) {
          await deposit({ amount, useAsCollateral });
        } else {
          await supply({ tokenId, extraDecimals, useAsCollateral, amount });
        }
        break;
      case "Borrow": {
        await borrow({ tokenId, extraDecimals, amount });
        break;
      }
      case "Withdraw": {
        const collateralAmount = Math.abs(Math.min(0, supplied - amount));
        await withdraw({
          tokenId,
          extraDecimals,
          amount,
          collateralAmount,
          maxAmount: isMax ? withdrawMaxAmount : undefined,
        });
        break;
      }
      case "Adjust":
        if (amount < collateral) {
          await removeCollateral({
            tokenId,
            extraDecimals,
            amount: amount === available ? undefined : collateral - amount,
          });
        }
        if (amount > collateral) {
          await addCollateral({
            tokenId,
            extraDecimals,
            amount: amount === available ? undefined : amount - collateral,
          });
        }
        break;
      case "Repay":
        await repay({
          tokenId,
          amount,
          extraDecimals,
          maxAmount: isMax ? repayMaxAmount : undefined,
        });
        break;
      default:
        break;
    }
  };

  const actionDisabled = useMemo(() => {
    if (action === "Supply" && amount > 0) return false;
    if (action !== "Adjust" && !amount) return true;
    if (action !== "Repay" && healthFactor > 0 && parseFloat(healthFactor?.toFixed(2)) <= 100)
      return true;
    return false;
  }, [amount, healthFactor]);

  const showToggle = action === "Supply" && canUseAsCollateral;

  return (
    <>
      {showToggle && (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" fontSize="0.85rem">
            Use as Collateral
          </Typography>
          <Switch onChange={handleSwitchToggle} />
        </Box>
      )}
      <Box display="flex" justifyContent="center">
        <LoadingButton
          disabled={actionDisabled}
          variant="contained"
          onClick={handleActionButtonClick}
          loading={loading}
        >
          {actionMapTitle[action]} {displaySymbol}
        </LoadingButton>
      </Box>
    </>
  );
}
