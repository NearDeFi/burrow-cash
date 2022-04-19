import { useState, useEffect, useRef } from "react";
import { Button, Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";

import NearWalletSelector from "@near-wallet-selector/core";
import { fetchAssetsAndMetadata } from "../../redux/assetsSlice";
import { logoutAccount, fetchAccount } from "../../redux/accountSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getBurrow, accountTrim } from "../../utils";

import { hideModal as _hideModal } from "../../redux/appSlice";

import { getAccountBalance, getAccountId } from "../../redux/accountSelectors";
import { trackConnectWallet } from "../../telemetry";
import NearIcon from "../../assets/near-icon.svg";
import { HamburgerMenu } from "./Menu";

const WalletButton = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const balance = useAppSelector(getAccountBalance);
  const accountId = useAppSelector(getAccountId);

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

  const onWalletButtonClick = async () => {
    if (accountId) return;
    trackConnectWallet();
    selector?.show();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      sx={{
        gridArea: "wallet",
        marginLeft: "auto",
        marginRight: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      {accountId ? (
        <Box
          sx={{
            marginTop: 0.6,
            fontSize: "0.8rem",
            display: "flex",
            flexFlow: isMobile ? "column" : "row",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{accountTrim(accountId)}</div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginLeft: 4 }}>
            {Number.parseFloat(balance).toFixed(2)}
            <NearIcon style={{ marginTop: -5, marginRight: -5, width: "1.5rem" }} />
          </div>
        </Box>
      ) : (
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
          Connect Wallet
        </Button>
      )}
      <Box>
        <IconButton onClick={handleOpenMenu} sx={{ ml: "0.5rem", mr: "-0.5rem" }}>
          <GiHamburgerMenu size={32} color={theme.palette.primary.main} />
        </IconButton>
      </Box>
      <HamburgerMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} selector={selector} />
    </Box>
  );
};

export default WalletButton;
