import { useContext, useState } from "react";
import { Button, Menu, MenuItem, Box, useTheme, useMediaQuery } from "@mui/material";

import { colors } from "../../style";
import { IBurrow } from "../../interfaces/burrow";
import { Burrow } from "../../index";
import { login, logout } from "../../utils";
import { ContractContext } from "../../context/contracts";
import { PERCENT_DIGITS, NEAR_DECIMALS } from "../../store/constants";
import { shrinkToken } from "../../store";

const WalletButton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { walletConnection, account } = useContext<IBurrow>(Burrow);
  const { accountBalance } = useContext(ContractContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const balance = accountBalance
    ? shrinkToken(accountBalance, NEAR_DECIMALS, PERCENT_DIGITS)
    : "...";

  const onWalletButtonClick = (event) => {
    if (!walletConnection?.isSignedIn()) {
      login(walletConnection);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        gridArea: "wallet",
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        flexDirection: isMobile ? "column-reverse" : "row",
      }}
    >
      {walletConnection?.isSignedIn() && (
        <Box sx={{ fontSize: "0.85rem", mr: isMobile ? 0 : "1rem", mt: isMobile ? "0.5rem" : 0 }}>
          NEAR: {balance}
        </Box>
      )}
      <Button
        size="small"
        sx={{ justifySelf: "end", alignItems: "center", backgroundColor: colors.primary }}
        variant="contained"
        onClick={onWalletButtonClick}
      >
        {walletConnection?.isSignedIn() ? account.accountId : "Connect Wallet"}
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "logout-button",
        }}
      >
        <MenuItem sx={{ backgroundColor: "white" }} onClick={() => logout(walletConnection)}>
          Log Out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WalletButton;
