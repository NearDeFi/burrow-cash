import { useState, useEffect, useRef } from "react";
import { Button, Menu, MenuItem, Box, useTheme, useMediaQuery, Divider } from "@mui/material";
import NearWalletSelector from "@near-wallet-selector/core";

import { useAppSelector, useAppDispatch } from "../../redux/hooks";

import { fetchAssetsAndMetadata } from "../../redux/assetsSlice";
import { fetchAccount } from "../../redux/accountSlice";
import { hideModal as _hideModal } from "../../redux/appSlice";

import { logoutAccount } from "../../redux/accountSlice";
import { getAccountBalance, getAccountId } from "../../redux/accountSelectors";
import { toggleDisplayValues, toggleShowDust } from "../../redux/appSlice";
import { getDisplayAsTokenValue, getShowDust } from "../../redux/appSelectors";
import { trackConnectWallet, trackDisplayAsUsd, trackShowDust } from "../../telemetry";

import { getBurrow } from "../../utils";

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

  const selectorRef = useRef<NearWalletSelector>();
  const [selector, setSelector] = useState<NearWalletSelector | null>(null);

  const hideModal = () => {
    dispatch(_hideModal());
  };

  const fetchData = () => {
    dispatch(fetchAssetsAndMetadata());
    dispatch(fetchAccount());
  };

  const signOut = () => {
    dispatch(logoutAccount());
  };

  const onMount = async () => {
    if (selector) return;

    const { selector: s } = await getBurrow({ fetchData, hideModal, signOut });

    selectorRef.current = s;
    setSelector(s);
  };
  useEffect(() => {
    onMount();
  }, []);

  const onWalletButtonClick = async (event) => {
    if (!accountId) {
      handleSignIn();
      trackConnectWallet();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleSwitchWallet = async () => {
    await handleSignOut();
    selector?.show();
  };

  const handleSignIn = () => {
    selector?.show();
  };

  const handleSignOut = async () => {
    await selector?.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
    signOut();
    handleClose();
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
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleSwitchWallet}>
          Switch Wallet
        </MenuItem>
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleSignOut}>
          Log Out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WalletButton;
