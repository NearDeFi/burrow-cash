import { Modal as MUIModal, Typography, Box } from "@mui/material";

import { USD_FORMAT, PERCENT_DIGITS } from "../../store";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { hideModal } from "../../redux/appSlice";
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
import { Wrapper } from "./style";
import { getModalData } from "./utils";
import {
  NotConnected,
  CloseButton,
  TokenInfo,
  Available,
  HealthFactor,
  Rates,
  Alerts,
} from "./components";
import Controls from "./Controls";
import Action from "./Action";

const Modal = () => {
  const isOpen = useAppSelector(getModalStatus);
  const accountId = useAppSelector(getAccountId);
  const asset = useAppSelector(getAssetData);
  const { amount } = useAppSelector(getSelectedValues);
  const dispatch = useAppDispatch();

  const { action = "Deposit", tokenId } = asset;

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
    alerts,
    remainingCollateral,
  } = getModalData({ ...asset, maxBorrowAmount, healthFactor, amount });

  const total = (price$ * amount).toLocaleString(undefined, USD_FORMAT);
  const totalAvailable = Number(
    Math.max(0, Number((available || 0).toFixed(PERCENT_DIGITS)) - 1 / 1e4).toFixed(PERCENT_DIGITS),
  );

  const handleClose = () => dispatch(hideModal());

  const displaySymbol = symbol === "wNEAR" ? "NEAR" : symbol;

  return (
    <MUIModal open={isOpen} onClose={handleClose}>
      <Wrapper>
        <Box sx={{ overflowY: "auto" }} p="1rem">
          {!accountId && <NotConnected />}
          <CloseButton onClose={handleClose} />
          <TokenInfo action={action} apy={apy} icon={icon} name={name} />
          <Available
            totalAvailable={totalAvailable}
            displaySymbol={displaySymbol}
            available$={available$}
            price={price}
          />
          <Controls amount={amount} available={available} />
          <HealthFactor value={healthFactor} />
          {action === "Withdraw" && (
            <Typography textAlign="center" mt="0.5rem" fontSize="0.75rem" fontWeight="500">
              Remaining collateral: {remainingCollateral}
            </Typography>
          )}
          <Typography textAlign="center" mt="1rem" fontSize="1rem" fontWeight="500">
            <span>{totalTitle}</span>
            <span>{total}</span>
          </Typography>
          <Rates action={action} rates={rates} />
          <Alerts data={alerts} />
          <Action
            maxBorrowAmount={maxBorrowAmount}
            healthFactor={healthFactor}
            displaySymbol={displaySymbol}
          />
        </Box>
      </Wrapper>
    </MUIModal>
  );
};

export default Modal;
