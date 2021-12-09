import { Modal as MUIModal, Typography, Box, Switch, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { USD_FORMAT, PERCENT_DIGITS } from "../../store";
import Input from "../Input";
import Slider from "../Slider";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  getModalStatus,
  getAssetData,
  hideModal,
  updateAmount,
  toggleUseAsCollateral,
  getSelectedValues,
} from "../../redux/appSlice";
import { getMaxBorrowAmount, getAccountId } from "../../redux/accountSlice";
import TokenIcon from "../TokenIcon";
import { Wrapper } from "./style";
import { getModalData } from "./utils";

const Modal = () => {
  const isOpen = useAppSelector(getModalStatus);
  const accountId = useAppSelector(getAccountId);
  const asset = useAppSelector(getAssetData);
  const { amount } = useAppSelector(getSelectedValues);
  const maxBorrowAmount = useAppSelector(getMaxBorrowAmount(asset.tokenId));
  const dispatch = useAppDispatch();
  const handleClose = () => dispatch(hideModal());

  const {
    action,
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
  } = getModalData({ ...asset, maxBorrowAmount });

  const sliderValue = (amount * 100) / available;
  const total = (price$ * amount).toLocaleString(undefined, USD_FORMAT);

  const handleInputChange = (e) => {
    dispatch(updateAmount({ amount: e.target.value }));
  };

  const handleMaxClick = () => {
    dispatch(updateAmount({ amount: available }));
  };

  const handleSliderChange = (e) => {
    const { value: percent } = e.target;
    const value = (Number(available) * percent) / 100;
    dispatch(updateAmount({ amount: Number(value.toFixed(PERCENT_DIGITS)) }));
  };

  const handleSwitchToggle = (event) => {
    dispatch(toggleUseAsCollateral({ useAsCollateral: event.target.checked }));
  };

  const handleActionButtonClick = () => {
    console.log("handleActionButtonClick");
  };

  const showToggle = action === "Supply" && canUseAsCollateral;

  return (
    <MUIModal open={isOpen} onClose={handleClose}>
      <Wrapper>
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
          <span>{apy}</span>
        </Typography>
        <Box mt="1rem" mb="0.5rem" display="flex" justifyContent="space-between">
          <Typography variant="body1" fontSize="0.85rem" fontWeight="500">
            Available: {available} {symbol} ({available$})
          </Typography>
          <Typography variant="body1" fontSize="0.85rem" fontWeight="500">
            1 {symbol} = {price}
          </Typography>
        </Box>
        <Input
          value={amount}
          type="number"
          onClickMax={handleMaxClick}
          onChange={handleInputChange}
        />
        <Box px="0.5rem" my="1rem">
          <Slider value={sliderValue} onChange={handleSliderChange} />
        </Box>
        <Typography textAlign="center" fontSize="1rem" fontWeight="500">
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
        <Box display="flex" justifyContent="center" mt="2rem">
          <Button variant="contained" onClick={handleActionButtonClick}>
            {action} {symbol}
          </Button>
        </Box>
      </Wrapper>
    </MUIModal>
  );
};

export default Modal;
