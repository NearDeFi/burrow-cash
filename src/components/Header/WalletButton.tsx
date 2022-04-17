import { useState } from "react";
import { Button, Menu, MenuItem, Box, useTheme, Divider, IconButton } from "@mui/material";
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";

import { login, logout, getBurrow } from "../../utils";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { logoutAccount, farmClaimAll, fetchAccount } from "../../redux/accountSlice";
import { getAccountBalance, getAccountId } from "../../redux/accountSelectors";
import { toggleDisplayValues, toggleShowDust } from "../../redux/appSlice";
import { getDisplayAsTokenValue, getShowDust } from "../../redux/appSelectors";
import {
  trackConnectWallet,
  trackDisplayAsUsd,
  trackLogout,
  trackShowDust,
  trackClaimButton,
} from "../../telemetry";

const WalletButton = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const balance = useAppSelector(getAccountBalance);
  const accountId = useAppSelector(getAccountId);
  const displayAsTokenValue = useAppSelector(getDisplayAsTokenValue);
  const showDust = useAppSelector(getShowDust);

  const onWalletButtonClick = async () => {
    if (accountId) return;
    const { walletConnection } = await getBurrow();
    trackConnectWallet();
    login(walletConnection);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleDisplayValues = () => {
    trackDisplayAsUsd();
    dispatch(toggleDisplayValues());
  };

  const handleToggleShowDust = () => {
    trackShowDust();
    dispatch(toggleShowDust());
  };

  const handleLogout = async () => {
    const { walletConnection } = await getBurrow();
    dispatch(logoutAccount());
    trackLogout();
    logout(walletConnection);
  };

  const handleClaimAll = async () => {
    handleClose();
    trackClaimButton();
    dispatch(farmClaimAll()).then(() => {
      dispatch(fetchAccount());
    });
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
            backgroundColor: theme.palette.primary.main,
          }}
          variant="contained"
          onClick={onWalletButtonClick}
        >
          {accountId || "Connect Wallet"}
        </Button>
        <IconButton onClick={handleOpenMenu}>
          <GiHamburgerMenu size={32} color={theme.palette.primary.main} />
        </IconButton>
      </Box>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "logout-button",
        }}
      >
        {accountId && (
          <MenuItem sx={{ backgroundColor: "white" }} onClick={handleClaimAll}>
            Claim All Rewards
          </MenuItem>
        )}
        <Divider />
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleToggleDisplayValues}>
          Display values as {displayAsTokenValue ? "usd" : "token"}
        </MenuItem>
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleToggleShowDust}>
          {showDust ? "Hide" : "Show"} dust
        </MenuItem>
        <Divider />
        {accountId && (
          <MenuItem sx={{ backgroundColor: "white" }} onClick={handleLogout}>
            Log Out
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default WalletButton;
