import { useState, useMemo } from "react";
import { Modal as MUIModal, Typography, Box, Switch, Alert, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";

import { USD_FORMAT, PERCENT_DIGITS, APY_FORMAT } from "../../store";
import { nearTokenId } from "../../utils";
import Input from "../Input";
import Slider from "../Slider";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { hideModal, updateAmount, toggleUseAsCollateral } from "../../redux/appSlice";
import { getModalStatus, getAssetData, getSelectedValues } from "../../redux/appSelectors";
import {
  getMaxBorrowAmount,
  getAccountId,
  recomputeHealthFactor,
  recomputeHealthFactorWithdraw,
  recomputeHealthFactorAdjust,
  recomputeHealthFactorSupply,
  recomputeHealthFactorRepay,
} from "../../redux/accountSelectors";
import TokenIcon from "../TokenIcon";
import { Wrapper } from "./style";
import { getModalData } from "./utils";
import { repay } from "../../store/actions/repay";
import { supply } from "../../store/actions/supply";
import { deposit } from "../../store/actions/deposit";
import { borrow } from "../../store/actions/borrow";
import { withdraw } from "../../store/actions/withdraw";
import { removeCollateral } from "../../store/actions/removeCollateral";
import { addCollateral } from "../../store/actions/addCollateral";

const Modal = () => {
  const [loading, setLoading] = useState(false);
  const isOpen = useAppSelector(getModalStatus);
  const accountId = useAppSelector(getAccountId);
  const asset = useAppSelector(getAssetData);
  const { amount, useAsCollateral } = useAppSelector(getSelectedValues);
  const dispatch = useAppDispatch();

  const { action, tokenId } = asset;

  const healthFactor = useAppSelector(
    action === "Withdraw"
      ? recomputeHealthFactorWithdraw(tokenId, amount)
      : action === "Adjust"
      ? recomputeHealthFactorAdjust(tokenId, amount)
      : action === "Supply"
      ? recomputeHealthFactorSupply(tokenId, amount)
      : action === "Repay"
      ? recomputeHealthFactorRepay(tokenId, amount)
      : recomputeHealthFactor(tokenId, amount),
  );

  const maxBorrowAmount = useAppSelector(getMaxBorrowAmount(tokenId));

  const {
    name,
    symbol,
    icon,
    apy,
    price,
    price$,
    available,
    available$,
    totalTitle,
    rates,
    canUseAsCollateral,
    extraDecimals,
    collateral,
    supplied,
    alerts,
    remainingCollateral,
  } = getModalData({ ...asset, maxBorrowAmount, healthFactor, amount });

  const sliderValue = (amount * 100) / available;
  const total = (price$ * amount).toLocaleString(undefined, USD_FORMAT);
  const totalAvailable = Number(
    Math.max(0, Number((available || 0).toFixed(PERCENT_DIGITS)) - 1 / 1e4).toFixed(PERCENT_DIGITS),
  );

  const handleClose = () => dispatch(hideModal());

  const handleInputChange = (e) => {
    if (Number(e.target.value) > available) return;
    dispatch(updateAmount({ amount: Number(e.target.value) || 0 }));
  };

  const handleMaxClick = () => {
    dispatch(updateAmount({ amount: totalAvailable }));
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleSliderChange = (e) => {
    const { value: percent } = e.target;
    const value = (Number(available) * percent) / 100;
    const amountToBorrow = Number(value.toFixed(PERCENT_DIGITS));
    dispatch(updateAmount({ amount: amountToBorrow }));
  };

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
        const amountToBorrow =
          amount === Number(available.toFixed(PERCENT_DIGITS)) ? amount * 0.99 : amount;
        await borrow({ tokenId, extraDecimals, amount: amountToBorrow });
        break;
      }
      case "Withdraw": {
        const collateralAmount = Math.abs(Math.min(0, supplied - amount));
        await withdraw({ tokenId, extraDecimals, amount, collateralAmount });
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
        await repay({ tokenId, amount, extraDecimals });
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

  const displaySymbol = symbol === "wNEAR" ? "NEAR" : symbol;
  const healthFactorColor =
    healthFactor === -1
      ? "black"
      : healthFactor < 180
      ? "red"
      : healthFactor < 200
      ? "orange"
      : "green";
  const healthFactorDisplayValue = healthFactor === -1 ? "N/A" : `${healthFactor?.toFixed(2)}%`;

  const inputAmount = `${amount}`
    .replace(/[^0-9.-]/g, "")
    .replace(/(\..*)\./g, "$1")
    .replace(/(?!^)-/g, "")
    .replace(/^0+(\d)/gm, "$1");

  return (
    <MUIModal open={isOpen} onClose={handleClose}>
      <Wrapper>
        <Box sx={{ overflowY: "auto", padding: "1rem" }}>
          {!accountId && (
            <Box
              position="absolute"
              display="flex"
              justifyContent="center"
              alignItems="center"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bgcolor="rgba(255,255,255,0.85)"
              zIndex="1"
            >
              <Typography variant="h5" bgcolor="#fff">
                Please connect your account
              </Typography>
            </Box>
          )}
          <Box
            onClick={handleClose}
            position="absolute"
            right="1rem"
            zIndex="2"
            sx={{ cursor: "pointer" }}
            bgcolor="white"
          >
            <CloseIcon />
          </Box>
          <Typography textAlign="center" fontWeight="500" fontSize="1.5rem">
            {action}
          </Typography>
          <Box display="grid" justifyContent="center" mt="2rem">
            <TokenIcon icon={icon} />
          </Box>
          <Typography textAlign="center" fontSize="0.85rem" fontWeight="500" mt="1rem">
            {name}
            <br />
            <span>{apy?.toLocaleString(undefined, APY_FORMAT)}%</span>
          </Typography>
          <Box mt="1rem" mb="0.5rem" display="flex" justifyContent="space-between">
            <Typography variant="body1" fontSize="0.85rem" fontWeight="500">
              Available: {totalAvailable} {displaySymbol} ({available$})
            </Typography>
            <Typography variant="body1" fontSize="0.85rem" fontWeight="500">
              1 {displaySymbol} = ${price}
            </Typography>
          </Box>
          <Input
            value={inputAmount}
            type="number"
            step="0.01"
            onClickMax={handleMaxClick}
            onChange={handleInputChange}
            onFocus={handleFocus}
          />
          <Box mx="1.5rem" my="1rem">
            <Slider value={sliderValue} onChange={handleSliderChange} />
          </Box>
          <Box
            fontSize="1rem"
            fontWeight="500"
            border="1px solid black"
            p="0.5rem"
            m="0.5rem"
            width="15rem"
            margin="0 auto"
            display="flex"
            justifyContent="center"
          >
            <span>Health Factor:</span>
            <Box ml={1} color={healthFactorColor}>
              {healthFactorDisplayValue}
            </Box>
          </Box>
          {action === "Withdraw" && (
            <Typography textAlign="center" mt="0.5rem" fontSize="0.75rem" fontWeight="500">
              Remaining collateral: {remainingCollateral}
            </Typography>
          )}
          <Typography textAlign="center" mt="1rem" fontSize="1rem" fontWeight="500">
            <span>{totalTitle}</span>
            <span>{total}</span>
          </Typography>
          {rates && (
            <Box>
              <Typography fontSize="0.85rem" fontWeight="bold">
                {action} Rates
              </Typography>
              {rates.map(({ label, value }) => (
                <Box
                  mt="0.5rem"
                  key={label}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" fontSize="0.85rem">
                    {label}
                  </Typography>
                  <Typography variant="body1" fontSize="0.85rem" fontWeight="bold">
                    {value}
                  </Typography>
                </Box>
              ))}
              {showToggle && (
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" fontSize="0.85rem">
                    Use as Collateral
                  </Typography>
                  <Switch onChange={handleSwitchToggle} />
                </Box>
              )}
            </Box>
          )}
          <Stack my="1rem" spacing="1rem">
            {Object.keys(alerts).map((alert) => (
              <Alert key={alert} severity={alerts[alert].severity}>
                {alerts[alert].title}
              </Alert>
            ))}
          </Stack>
          <Box display="flex" justifyContent="center">
            <LoadingButton
              disabled={actionDisabled}
              variant="contained"
              onClick={handleActionButtonClick}
              loading={loading}
            >
              {action} {displaySymbol}
            </LoadingButton>
          </Box>
        </Box>
      </Wrapper>
    </MUIModal>
  );
};

export default Modal;
