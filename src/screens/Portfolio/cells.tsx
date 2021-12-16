import { Box, Button } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { showModal } from "../../redux/appSlice";
import { getCollateralAmount } from "../../redux/accountSlice";

export const WithdrawCell = ({ rowData: { supplied, tokenId } }) => {
  if (!supplied) return false;
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(showModal({ action: "Withdraw", tokenId, amount: 0 }));
  };

  return (
    <Box>
      <Button size="small" variant="contained" onClick={handleClick}>
        Withdraw
      </Button>
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
