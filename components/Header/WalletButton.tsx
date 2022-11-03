import { useState, useEffect, useRef } from "react";
import { Button, Box, IconButton, useTheme, useMediaQuery, Typography } from "@mui/material";
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";
import type { WalletSelector } from "@near-wallet-selector/core";

import { fetchAssets, fetchRefPrices } from "../../redux/assetsSlice";
import { logoutAccount, fetchAccount, setAccountId } from "../../redux/accountSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getBurrow, accountTrim } from "../../utils";

import { hideModal as _hideModal } from "../../redux/appSlice";

import { getAccountBalance, getAccountId } from "../../redux/accountSelectors";
import { trackConnectWallet } from "../../utils/telemetry";
import { useDegenMode } from "../../hooks/hooks";
import NearIcon from "../../public/near-icon.svg";
import { HamburgerMenu } from "./Menu";
import Disclaimer from "../Disclaimer";
import { useDisclaimer } from "../../hooks/useDisclaimer";

const WalletButton = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const balance = useAppSelector(getAccountBalance);
  const accountId = useAppSelector(getAccountId);
  const { degenMode } = useDegenMode();
  const [isDisclaimerOpen, setDisclaimer] = useState(false);
  const { getDisclaimer: hasAgreedDisclaimer } = useDisclaimer();

  const selectorRef = useRef<WalletSelector>();
  const [selector, setSelector] = useState<WalletSelector | null>(null);

  const hideModal = () => {
    dispatch(_hideModal());
  };

  const fetchData = (id?: string) => {
    dispatch(setAccountId(id));
    dispatch(fetchAccount());
    dispatch(fetchAssets()).then(() => dispatch(fetchRefPrices()));
  };

  const signOut = () => {
    dispatch(logoutAccount());
  };

  const onMount = async () => {
    if (selector) return;
    const { selector: s } = await getBurrow({ fetchData, hideModal, signOut });

    selectorRef.current = s;
    setSelector(s);
    window.selector = s;
  };

  useEffect(() => {
    onMount();
  }, []);

  const onWalletButtonClick = async () => {
    if (!hasAgreedDisclaimer) {
      setDisclaimer(true);
      return;
    }
    if (accountId) return;
    trackConnectWallet();
    window.modal.show();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      sx={{
        gridArea: "wallet",
        marginLeft: "1rem",
        marginRight: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      {accountId ? (
        <Box
          sx={{
            fontSize: "0.8rem",
            display: "flex",
            flexFlow: isMobile ? "column" : "row",
            alignItems: ["flex-end", "center"],
          }}
        >
          <Typography sx={{ fontWeight: "semibold", fontSize: "0.85rem" }}>
            {accountTrim(accountId)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginLeft: 1,
              alignItems: "center",
              mt: ["-0.3rem", 0],
            }}
          >
            <Typography sx={{ lineHeight: 0, fontSize: "0.85rem" }}>
              {Number.parseFloat(balance).toFixed(2)}
            </Typography>
            <NearIcon style={{ width: "1.5rem", height: "1.5rem", fill: "white" }} />
            {degenMode.enabled && (
              <Box
                sx={{
                  marginRight: "-6px",
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.secondary.main,
                  borderRadius: "0.3rem",
                  fontSize: "0.65rem",
                  px: "0.3rem",
                  py: "0.1rem",
                }}
              >
                degen
              </Box>
            )}
          </Box>
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
          <GiHamburgerMenu size={32} color="white" />
        </IconButton>
      </Box>
      <HamburgerMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      <Disclaimer isOpen={isDisclaimerOpen} onClose={() => setDisclaimer(false)} />
    </Box>
  );
};

export default WalletButton;
