import { useState } from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { showModal } from "../../redux/appSlice";
import { getCollateralAmount } from "../../redux/selectors/getCollateralAmount";

export const WithdrawCell = ({ rowData }) => {
  const [open, setOpen] = useState(false);
  const { supplied, tokenId, canWithdraw } = rowData;
  if (!supplied) return false;
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (canWithdraw) {
      dispatch(showModal({ action: "Withdraw", tokenId, amount: 0 }));
    } else {
      setOpen(true);
    }
  };

  return (
    <Box>
      <Button size="small" variant="contained" onClick={handleClick}>
        Withdraw
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="warning">Can&apos;t withdraw this asset</Alert>
      </Snackbar>
    </Box>
  );
};

export const AdjustCell = ({ rowData: { canUseAsCollateral, tokenId } }) => {
  if (!canUseAsCollateral) return false;
  const dispatch = useAppDispatch();
  const amount = useAppSelector(getCollateralAmount(tokenId));

  const handleClick = () => {
    dispatch(showModal({ action: "Adjust", tokenId, amount }));
  };

  return (
    <Box>
      <Button size="small" variant="contained" onClick={handleClick}>
        Adjust
      </Button>
    </Box>
  );
};

export const RepayCell = ({ rowData: { tokenId } }) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(showModal({ action: "Repay", tokenId, amount: 0 }));
  };

  return (
    <Box>
      <Button size="small" variant="contained" onClick={handleClick}>
        Repay
      </Button>
    </Box>
  );
};
