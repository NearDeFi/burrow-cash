import { useState } from "react";
import { Button, Box, useTheme, IconButton } from "@mui/material";
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";

import { login, getBurrow, accountTrim } from "../../utils";
import { useAppSelector } from "../../redux/hooks";
import { getAccountBalance, getAccountId } from "../../redux/accountSelectors";
import { trackConnectWallet } from "../../telemetry";
import { HamburgerMenu } from "./Menu";

const WalletButton = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const balance = useAppSelector(getAccountBalance);
  const accountId = useAppSelector(getAccountId);

  const onWalletButtonClick = async () => {
    if (accountId) return;
    const { walletConnection } = await getBurrow();
    trackConnectWallet();
    login(walletConnection);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      sx={{
        gridArea: "wallet",
        marginLeft: "auto",
        marginRight: "0.5rem",
        display: "flex",
        alignItems: "center",
      }}
    >
      {accountId && <Box sx={{ fontSize: "0.85rem", mr: "1rem" }}>NEAR: {balance}</Box>}
      <Box>
        <Button
          size="small"
          sx={{
            justifySelf: "end",
            alignItems: "center",
            cursor: accountId ? "default" : "pointer",
          }}
          variant={accountId ? "outlined" : "contained"}
          onClick={onWalletButtonClick}
          disableRipple={!!accountId}
        >
          {accountTrim(accountId) || "Connect Wallet"}
        </Button>
        <IconButton onClick={handleOpenMenu}>
          <GiHamburgerMenu size={32} color={theme.palette.primary.main} />
        </IconButton>
      </Box>
      <HamburgerMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </Box>
  );
};

export default WalletButton;
