import { useEffect } from "react";
import { Modal as MUIModal, Typography, Box } from "@mui/material";

import { USD_FORMAT } from "../../store";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { hideModal } from "../../redux/appSlice";
import { getModalStatus, getAssetData, getSelectedValues } from "../../redux/appSelectors";
import { getWithdrawMaxAmount } from "../../redux/selectors/getWithdrawMaxAmount";
import { getAccountId } from "../../redux/accountSelectors";
import { getMaxBorrowAmount } from "../../redux/selectors/getMaxBorrowAmount";
import { recomputeHealthFactor } from "../../redux/selectors/recomputeHealthFactor";
import { recomputeHealthFactorAdjust } from "../../redux/selectors/recomputeHealthFactorAdjust";
import { recomputeHealthFactorWithdraw } from "../../redux/selectors/recomputeHealthFactorWithdraw";
import { recomputeHealthFactorSupply } from "../../redux/selectors/recomputeHealthFactorSupply";
import { recomputeHealthFactorRepay } from "../../redux/selectors/recomputeHealthFactorRepay";
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
  USNInfo,
} from "./components";
import Controls from "./Controls";
import Action from "./Action";
import { fetchAssetsAndMetadata, fetchRefPrices } from "../../redux/assetsSlice";

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
  const maxWithdrawAmount = useAppSelector(getWithdrawMaxAmount(tokenId));

  const {
    name,
    symbol,
    icon,
    apy,
    price,
    available,
    available$,
    totalTitle,
    rates,
    alerts,
    remainingCollateral,
  } = getModalData({ ...asset, maxBorrowAmount, maxWithdrawAmount, healthFactor, amount });

  const total = (price * amount).toLocaleString(undefined, USD_FORMAT);

  const handleClose = () => dispatch(hideModal());

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAssetsAndMetadata()).then(() => dispatch(fetchRefPrices()));
    }
  }, [isOpen]);

  return (
    <MUIModal open={isOpen} onClose={handleClose}>
      <Wrapper>
        <Box sx={{ overflowY: "auto" }} p="1rem">
          {!accountId && <NotConnected />}
          <CloseButton onClose={handleClose} />
          <TokenInfo action={action} apy={apy} icon={icon} name={name} />
          {action === "Supply" && symbol === "USN" && <USNInfo />}
          <Available
            totalAvailable={available}
            displaySymbol={symbol}
            available$={available$}
            price={price}
          />
          <Controls amount={amount} available={available} action={action} tokenId={tokenId} />
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
            displaySymbol={symbol}
          />
        </Box>
      </Wrapper>
    </MUIModal>
  );
};

export default Modal;
