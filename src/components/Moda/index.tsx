import { useState } from "react";
import { Modal as MUIModal, Typography, Box, Switch, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Input from "../Input";
import Slider from "../Slider";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getModalStatus, getAssetData, hideModal } from "../../redux/appSlice";
import { getMaxBorrowAmount } from "../../redux/accountSlice";
import TokenIcon from "../TokenIcon";
import { Wrapper } from "./style";
import { getModalData } from "./utils";

const Modal = () => {
  const [useAsCollateral, setUseCollateral] = useState(false);
  const isOpen = useAppSelector(getModalStatus);
  const asset = useAppSelector(getAssetData);
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
    available,
    available$,
    totalTitle,
    rates,
    canUseAsCollateral,
  } = getModalData({ ...asset, maxBorrowAmount });

  const inputValue = 0;
  const sliderValue = 0;
  const total = 0;

  const handleInputChange = () => {
    console.log("handleInputChange");
  };

  const handleMaxClick = () => {
    console.log("handleMaxClick");
  };

  const handleSliderChange = () => {
    console.log("handleSliderChange");
  };

  const handleActionButtonClick = () => {
    console.log("handleActionButtonClick", useAsCollateral);
  };

  const showToggle = action === "Supply" && canUseAsCollateral;

  return (
    <MUIModal open={isOpen} onClose={handleClose}>
      <Wrapper>
        <Box onClick={handleClose} position="absolute" right="1rem" sx={{ cursor: "pointer" }}>
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
          value={inputValue}
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
                <Switch onChange={(event) => setUseCollateral(event.target.checked)} />
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
