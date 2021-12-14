import { useContext, useState } from "react";
import { Button, Menu, MenuItem, Box, useTheme, useMediaQuery, Divider } from "@mui/material";

import { IBurrow } from "../../interfaces/burrow";
import { Burrow } from "../../index";
import { login, logout } from "../../utils";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getAccountBalance, logoutAccount } from "../../redux/accountSlice";
import { getDisplayAsTokenValue, toggleDisplayValues } from "../../redux/appSlice";

const WalletButton = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { walletConnection, account } = useContext<IBurrow>(Burrow);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const balance = useAppSelector(getAccountBalance);
  const displayAsTokenValue = useAppSelector(getDisplayAsTokenValue);

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

  const handleToggleDisplayValues = () => {
    dispatch(toggleDisplayValues());
  };

  const handleLogout = () => {
    dispatch(logoutAccount());
    logout(walletConnection);
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
        sx={{
          justifySelf: "end",
          alignItems: "center",
          backgroundColor: theme.palette.primary.main,
        }}
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
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleToggleDisplayValues}>
          Display values as {displayAsTokenValue ? "usd" : "token"}
        </MenuItem>
        <Divider />
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleLogout}>
          Log Out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WalletButton;
