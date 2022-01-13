import { useState } from "react";
import { Button, Menu, MenuItem, Box, useTheme, useMediaQuery, Divider } from "@mui/material";

import { login, logout, getBurrow } from "../../utils";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { logoutAccount } from "../../redux/accountSlice";
import { getAccountBalance, getAccountId } from "../../redux/accountSelectors";
import { toggleDisplayValues, toggleShowDust } from "../../redux/appSlice";
import { getDisplayAsTokenValue, getShowDust } from "../../redux/appSelectors";

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

  const onWalletButtonClick = async (event) => {
    if (!accountId) {
      const { walletConnection } = await getBurrow();
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

  const handleToggleShowDust = () => {
    dispatch(toggleShowDust());
  };

  const handleLogout = async () => {
    const { walletConnection } = await getBurrow();
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
