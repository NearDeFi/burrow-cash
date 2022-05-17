import { useState, useMemo, useEffect } from "react";
import { Box, Typography, Switch, Tooltip } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { FcInfo } from "@react-icons/all-files/fc/FcInfo";
import { nearTokenId } from "../../utils";
import { toggleUseAsCollateral, hideModal } from "../../redux/appSlice";
import { actionMapTitle, getModalData } from "./utils";
import { repay } from "../../store/actions/repay";
import { supply } from "../../store/actions/supply";
import { deposit } from "../../store/actions/deposit";
import { borrow } from "../../store/actions/borrow";
import { withdraw } from "../../store/actions/withdraw";
import { adjustCollateral } from "../../store/actions/adjustCollateral";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getSelectedValues, getAssetData } from "../../redux/appSelectors";
import { trackActionButton, trackUseAsCollateral } from "../../telemetry";
import { getWithdrawMaxAmount } from "../../redux/selectors/getWithdrawMaxAmount";

export default function Action({ maxBorrowAmount, healthFactor, displaySymbol }) {
  const [loading, setLoading] = useState(false);
  const { amount, useAsCollateral, isMax } = useAppSelector(getSelectedValues);
  const dispatch = useAppDispatch();
  const asset = useAppSelector(getAssetData);
  const { action = "Deposit", tokenId } = asset;
  const withdrawMaxAmount = useAppSelector(getWithdrawMaxAmount(tokenId));

  const { available, canUseAsCollateral, extraDecimals, collateral } = getModalData({
    ...asset,
    maxBorrowAmount,
    healthFactor,
    amount,
  });

  useEffect(() => {
    if (!canUseAsCollateral) {
      dispatch(toggleUseAsCollateral({ useAsCollateral: false }));
    }
  }, [useAsCollateral]);

  const handleSwitchToggle = (event) => {
    trackUseAsCollateral({ useAsCollateral: event.target.checked, action, tokenId });
    dispatch(toggleUseAsCollateral({ useAsCollateral: event.target.checked }));
  };

  const handleActionButtonClick = async () => {
    setLoading(true);
    trackActionButton(action, {
      tokenId,
      amount,
      isMax,
      useAsCollateral,
      available,
      collateral,
      sliderValue: Math.round((amount * 100) / available) || 0,
    });
    dispatch(hideModal());

    switch (action) {
      case "Supply":
        if (tokenId === nearTokenId) {
          await deposit({ amount, useAsCollateral, isMax });
        } else {
          await supply({
            tokenId,
            extraDecimals,
            useAsCollateral,
            amount,
            isMax,
          });
        }
        break;
      case "Borrow": {
        await borrow({ tokenId, extraDecimals, amount });
        break;
      }
      case "Withdraw": {
        await withdraw({
          tokenId,
          amount,
          maxAmount: withdrawMaxAmount,
          isMax,
        });
        break;
      }
      case "Adjust":
        await adjustCollateral({
          tokenId,
          extraDecimals,
          amount,
          isMax,
        });
        break;
      case "Repay":
        await repay({
          tokenId,
          amount,
          extraDecimals,
          isMax,
        });
        break;
      default:
        break;
    }
  };

  const actionDisabled = useMemo(() => {
    if (action === "Supply" && amount > 0) return false;
    if (action !== "Adjust" && !amount) return true;
    if (
      action !== "Repay" &&
      parseFloat(healthFactor?.toFixed(2)) >= 0 &&
      parseFloat(healthFactor?.toFixed(2)) <= 100
    )
      return true;
    return false;
  }, [amount, healthFactor]);

  const showToggle = action === "Supply";

  return (
    <>
      {showToggle && (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" fontSize="0.85rem">
            Use as Collateral
          </Typography>
          {!canUseAsCollateral && (
            <Tooltip
              sx={{ ml: "auto" }}
              placement="top"
              title="This asset can't be used as collateral yet"
            >
              <Box alignItems="center" display="flex">
                <FcInfo />
              </Box>
            </Tooltip>
          )}
          <Switch
            onChange={handleSwitchToggle}
            checked={useAsCollateral}
            disabled={!canUseAsCollateral}
          />
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
