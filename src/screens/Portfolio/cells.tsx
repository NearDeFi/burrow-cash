import { Box, Button } from "@mui/material";

import { useAppDispatch } from "../../redux/hooks";
import { showModal } from "../../redux/appSlice";

export const WithdrawCell = ({ rowData: { supplied, tokenId } }) => {
  if (!supplied) return false;
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(showModal({ action: "Withdraw", tokenId }));
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

  const handleClick = () => {
    dispatch(showModal({ action: "Adjust", tokenId }));
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
    dispatch(showModal({ action: "Repay", tokenId }));
  };

  return (
    <Box>
      <Button size="small" variant="contained" onClick={handleClick}>
        Repay
      </Button>
    </Box>
  );
};
