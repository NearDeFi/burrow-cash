import { useContext } from "react";
import { Box, Button } from "@mui/material";

import { IAssetDetailed, IMetadata, IAsset, IBalance } from "../../interfaces";
import { ModalContext, ModalState } from "../../components/Modal";

export const WithdrawCell = ({ rowData }) => {
  if (!rowData.supplied) return false;

  const modal: ModalState = useContext(ModalContext);

  const handleClick = () => {
    modal.setModalData({
      type: "Withdraw",
      title: "Withdraw",
      totalAmountTitle: "Withdraw Supply Amount",
      asset: {
        token_id: rowData.token_id,
        amount: Number(rowData.balance),
        name: rowData?.name || "Unknown",
        symbol: rowData?.symbol || "???",
        icon: rowData?.icon,
        valueInUSD: rowData.price?.usd || 0,
        apy: rowData.borrow_apr,
        canBeUsedAsCollateral: rowData.config.can_use_as_collateral,
      },
      buttonText: "Withdraw",
      config: rowData.config,
    });
    modal.handleOpen();
  };

  return (
    <Box>
      <Button size="small" variant="contained" onClick={handleClick}>
        Withdraw
      </Button>
    </Box>
  );
};

export const AdjustCell = ({ rowData }) => {
  if (!rowData.canUseAsCollateral) return false;

  const modal: ModalState = useContext(ModalContext);
  const handleClick = () => {
    modal.setModalData({
      type: "Adjust",
      title: "Adjust Collateral",
      totalAmountTitle: "Amount designated as collateral",
      asset: {
        token_id: rowData.token_id,
        amount: Number(rowData.balance),
        name: rowData?.name || "Unknown",
        symbol: rowData?.symbol || "???",
        icon: rowData?.icon,
        valueInUSD: rowData.price?.usd || 0,
        apy: rowData.borrow_apr,
        collateral: rowData.collateral,
        canBeUsedAsCollateral: rowData.config.can_use_as_collateral,
      },
      buttonText: "Adjust",
      config: rowData.config,
    });
    modal.handleOpen();
  };

  return (
    <Box>
      <Button size="small" variant="contained" onClick={handleClick}>
        Adjust
      </Button>
    </Box>
  );
};

export const RepayCell = ({
  rowData,
}: {
  rowData: IMetadata & IAsset & IAssetDetailed & { wallet: IBalance };
}) => {
  const modal: ModalState = useContext(ModalContext);

  const handleClick = () => {
    modal.setModalData({
      type: "Repay",
      title: "Repay",
      totalAmountTitle: "Repay Borrow Amount",
      asset: {
        token_id: rowData.token_id,
        amount:
          rowData.wallet.balance > Number(rowData.balance)
            ? Number(rowData.balance)
            : rowData.wallet.balance,
        name: rowData?.name || "Unknown",
        symbol: rowData?.symbol || "???",
        icon: rowData?.icon,
        valueInUSD: rowData.price?.usd || 0,
        apy: Number(rowData.borrow_apr),
      },
      buttonText: "Repay",
      config: rowData.config,
    });
    modal.handleOpen();
  };

  return (
    <Box>
      <Button size="small" variant="contained" onClick={handleClick}>
        Repay
      </Button>
    </Box>
  );
};
