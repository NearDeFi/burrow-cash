import { useState } from "react";
import { Button, Menu, MenuItem, Box, useTheme, useMediaQuery, Divider } from "@mui/material";

import { login, logout, getBurrow } from "../../utils";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { logoutAccount } from "../../redux/accountSlice";
import { getAccountBalance, getAccountId } from "../../redux/accountSelectors";
import { toggleDisplayValues, toggleShowDust } from "../../redux/appSlice";
import { getDisplayAsTokenValue, getShowDust } from "../../redux/appSelectors";
import { trackConnectWallet, trackDisplayAsUsd, trackLogout, trackShowDust } from "../../telemetry";
import { useFullDigits } from "../../hooks";

const WalletButton = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const balance = useAppSelector(getAccountBalance);
  const accountId = useAppSelector(getAccountId);
  const displayAsTokenValue = useAppSelector(getDisplayAsTokenValue);
  const showDust = useAppSelector(getShowDust);
  const { fullDigits, setDigits } = useFullDigits();
  const isCompact = fullDigits.table;

  const onWalletButtonClick = async (event) => {
    if (!accountId) {
      const { walletConnection } = await getBurrow();
      trackConnectWallet();
      login(walletConnection);
    } else {
      setAnchorEl(event.currentTarget);
    }
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

  const handleToggleFulldigits = () => {
    setDigits({ table: !fullDigits.table });
  };

  return (
    <Box
      sx={{
        gridArea: "wallet",
        marginLeft: "auto",
        marginRight: "0.5rem",
        display: "flex",
        alignItems: "center",
        flexDirection: isMobile ? "column-reverse" : "row",
      }}
    >
      {accountId && (
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
        {accountId || "Connect Wallet"}
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
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleToggleFulldigits}>
          Display {isCompact ? "full" : "compact"} amounts
        </MenuItem>
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleToggleShowDust}>
          {showDust ? "Hide" : "Show"} dust
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
