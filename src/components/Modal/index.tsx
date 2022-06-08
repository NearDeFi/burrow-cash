import { useEffect } from "react";
import { Modal as MUIModal, Typography, Box, Stack } from "@mui/material";

import { USD_FORMAT } from "../../store";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { hideModal } from "../../redux/appSlice";
import { getModalStatus, getAssetData, getSelectedValues } from "../../redux/appSelectors";
import { getWithdrawMaxAmount } from "../../redux/selectors/getWithdrawMaxAmount";
import { getAccountId } from "../../redux/accountSelectors";
import { getBorrowMaxAmount } from "../../redux/selectors/getBorrowMaxAmount";
import { recomputeHealthFactor } from "../../redux/selectors/recomputeHealthFactor";
import { recomputeHealthFactorAdjust } from "../../redux/selectors/recomputeHealthFactorAdjust";
import { recomputeHealthFactorWithdraw } from "../../redux/selectors/recomputeHealthFactorWithdraw";
import { recomputeHealthFactorSupply } from "../../redux/selectors/recomputeHealthFactorSupply";
import { recomputeHealthFactorRepay } from "../../redux/selectors/recomputeHealthFactorRepay";
import { recomputeHealthFactorRepayFromDeposits } from "../../redux/selectors/recomputeHealthFactorRepayFromDeposits";

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
import { fetchAssets, fetchRefPrices } from "../../redux/assetsSlice";
import { useDegenMode } from "../../hooks/hooks";

const Modal = () => {
  const isOpen = useAppSelector(getModalStatus);
  const accountId = useAppSelector(getAccountId);
  const asset = useAppSelector(getAssetData);
  const { amount } = useAppSelector(getSelectedValues);
  const dispatch = useAppDispatch();
  const { repayFromDeposits } = useDegenMode();

  const { action = "Deposit", tokenId } = asset;

  const healthFactor = useAppSelector(
    action === "Withdraw"
      ? recomputeHealthFactorWithdraw(tokenId, amount)
      : action === "Adjust"
      ? recomputeHealthFactorAdjust(tokenId, amount)
      : action === "Supply"
      ? recomputeHealthFactorSupply(tokenId, amount)
      : action === "Repay" && repayFromDeposits
      ? recomputeHealthFactorRepayFromDeposits(tokenId, amount)
      : action === "Repay"
      ? recomputeHealthFactorRepay(tokenId, amount)
      : recomputeHealthFactor(tokenId, amount),
  );

  const maxBorrowAmount = useAppSelector(getBorrowMaxAmount(tokenId));
  const maxWithdrawAmount = useAppSelector(getWithdrawMaxAmount(tokenId));

  const { symbol, apy, price, available, available$, totalTitle, rates, alerts } = getModalData({
    ...asset,
    maxBorrowAmount,
    maxWithdrawAmount,
    repayFromDeposits,
    healthFactor,
    amount,
  });

  const total = (price * amount).toLocaleString(undefined, USD_FORMAT);

  const handleClose = () => dispatch(hideModal());

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAssets()).then(() => dispatch(fetchRefPrices()));
    }
  }, [isOpen]);

  return (
    <MUIModal open={isOpen} onClose={handleClose}>
      <Wrapper>
        <Box sx={{ overflowY: "auto", p: ["1.5rem", "2rem"] }}>
          {!accountId && <NotConnected />}
          <CloseButton onClose={handleClose} />
          <TokenInfo apy={apy} asset={asset} />
          {action === "Supply" && symbol === "USN" && <USNInfo />}
          <Available totalAvailable={available} available$={available$} />
          <Controls amount={amount} available={available} action={action} tokenId={tokenId} />
          <Stack
            boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
            borderRadius={1}
            mt="2rem"
            p={2}
            gap={0.5}
          >
            <Typography fontWeight="400" mb="1rem">
              Details
            </Typography>
            <HealthFactor value={healthFactor} />
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize="0.85rem" color="gray">
                <span>{totalTitle}</span>
              </Typography>
              <Typography fontSize="0.85rem" fontWeight="500">
                {total}
              </Typography>
            </Box>
            <Rates rates={rates} />
          </Stack>
          <Alerts data={alerts} />
          <Action maxBorrowAmount={maxBorrowAmount} healthFactor={healthFactor} />
        </Box>
      </Wrapper>
    </MUIModal>
  );
};

export default Modal;
