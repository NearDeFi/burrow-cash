import { Menu, Divider, Typography, useTheme } from "@mui/material";

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
} from "../../utils/telemetry";
import { useTicker } from "../../hooks/useTicker";
import { useDisclaimer } from "../../hooks/useDisclaimer";
import { isTestnet } from "../../utils/config";
import { StyledMenuItem } from "./style";

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export const HamburgerMenu = ({ anchorEl, setAnchorEl }: Props) => {
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
  const { hasTicker, toggleTicker } = useTicker();
  const { setDisclaimer } = useDisclaimer();

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
    window.modal.show();
  };

  const handleSignOut = async () => {
    const { signOut } = await getBurrow();
    signOut();
    trackLogout();
    handleClose();
    setDisclaimer(false);
  };

  const handleToggleAmountDigits = () => {
    const digits = { table: !fullDigits?.table };
    trackToggleAmountDigits(digits);
    setDigits(digits);
  };

  const handleToggleTicker = () => {
    if (isTestnet) return;
    toggleTicker();
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
        <StyledMenuItem
          sx={{ backgroundColor: theme.palette.primary.main }}
          onClick={setDegenMode}
          key={2}
        >
          Degen Mode: {degenMode.enabled ? "On" : "Off"}
        </StyledMenuItem>,
        <Divider key={3} />,
      ]}
      <StyledMenuItem onClick={handleToggleDisplayValues}>
        Display Values As {displayAsTokenValue ? "USD" : "Token"}
      </StyledMenuItem>
      <StyledMenuItem onClick={handleToggleAmountDigits}>
        Display {isCompact ? "Full" : "Compact"} Amounts
      </StyledMenuItem>
      <StyledMenuItem onClick={handleToggleShowDust}>
        {showDust ? "Hide" : "Show"} Dust
      </StyledMenuItem>
      {!isTestnet && (
        <StyledMenuItem onClick={handleToggleTicker}>
          {hasTicker ? "Hide" : "Show"} Ticker
        </StyledMenuItem>
      )}
      {accountId && [
        <Divider key={1} />,
        <StyledMenuItem onClick={handleSwitchWallet} key={2}>
          Switch Wallet
        </StyledMenuItem>,
        <Divider key={3} />,
        <StyledMenuItem onClick={handleSignOut} key={4}>
          Sign Out
        </StyledMenuItem>,
      ]}
      <Divider key={2} />
      <StyledMenuItem>
        <Typography fontSize="0.75rem">App Build Id: {appVersion}</Typography>
      </StyledMenuItem>
    </Menu>
  );
};

const ClaimMenuItem = (props) => (
  <StyledMenuItem name="menu" {...props}>
    Claim All Rewards
  </StyledMenuItem>
);
