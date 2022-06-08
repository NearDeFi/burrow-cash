import { Menu, MenuItem, Divider, Typography, useTheme } from "@mui/material";
import NearWalletSelector from "@near-wallet-selector/core";

import ClaimAllRewards from "../ClaimAllRewards";
import { getBurrow, getLocalAppVersion } from "../../utils";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getAccountId } from "../../redux/accountSelectors";
import { toggleDisplayValues, toggleShowDust } from "../../redux/appSlice";
import { getDisplayAsTokenValue, getShowDust } from "../../redux/appSelectors";
import { useFullDigits } from "../../hooks/useFullDigits";
import { useDegenMode } from "../../hooks/hooks";

import {
  trackDisplayAsUsd,
  trackLogout,
  trackShowDust,
  trackToggleAmountDigits,
} from "../../telemetry";

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  selector: null | NearWalletSelector;
}

export const HamburgerMenu = ({ anchorEl, setAnchorEl, selector }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);
  const accountId = useAppSelector(getAccountId);
  const displayAsTokenValue = useAppSelector(getDisplayAsTokenValue);
  const showDust = useAppSelector(getShowDust);
  const { fullDigits, setDigits } = useFullDigits();
  const isCompact = fullDigits?.table;
  const appVersion = getLocalAppVersion();
  const { degenMode, setDegenMode } = useDegenMode();

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

  const handleSwitchWallet = async () => {
    await handleSignOut();
    selector?.show();
  };

  const handleSignOut = async () => {
    const { signOut } = await getBurrow();
    signOut();
    trackLogout();
    handleClose();
  };

  const handleToggleAmountDigits = () => {
    const digits = { table: !fullDigits?.table };
    trackToggleAmountDigits(digits);
    setDigits(digits);
  };

  return (
    <Menu
      id="profile-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "logout-button",
      }}
    >
      {accountId && [
        <ClaimAllRewards location="menu" onDone={handleClose} Button={ClaimMenuItem} key={1} />,
        <MenuItem
          sx={{ backgroundColor: theme.palette.primary.light }}
          onClick={setDegenMode}
          key={2}
        >
          Degen Mode: {degenMode ? "On" : "Off"}
        </MenuItem>,
        <Divider key={3} />,
      ]}
      <MenuItem sx={{ backgroundColor: "white" }} onClick={handleToggleDisplayValues}>
        Display Values As {displayAsTokenValue ? "USD" : "Token"}
      </MenuItem>
      <MenuItem sx={{ backgroundColor: "white" }} onClick={handleToggleAmountDigits}>
        Display {isCompact ? "Full" : "Compact"} Amounts
      </MenuItem>
      <MenuItem sx={{ backgroundColor: "white" }} onClick={handleToggleShowDust}>
        {showDust ? "Hide" : "Show"} Dust
      </MenuItem>
      {accountId && [
        <Divider key={1} />,
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleSwitchWallet} key={2}>
          Switch Wallet
        </MenuItem>,
        <Divider key={3} />,
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleSignOut} key={4}>
          Sign Out
        </MenuItem>,
      ]}
      <Divider key={2} />
      <MenuItem sx={{ backgroundColor: "white" }}>
        <Typography fontSize="0.75rem">App Version: {appVersion}</Typography>
      </MenuItem>
    </Menu>
  );
};

const ClaimMenuItem = (props) => (
  <MenuItem name="menu" sx={{ backgroundColor: "white" }} {...props}>
    Claim All Rewards
  </MenuItem>
);
