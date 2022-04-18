import { Menu, MenuItem, Divider } from "@mui/material";

import { logout, getBurrow } from "../../utils";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { logoutAccount, farmClaimAll, fetchAccount } from "../../redux/accountSlice";
import { getAccountId } from "../../redux/accountSelectors";
import { toggleDisplayValues, toggleShowDust } from "../../redux/appSlice";
import { getDisplayAsTokenValue, getShowDust } from "../../redux/appSelectors";
import { trackDisplayAsUsd, trackLogout, trackShowDust, trackClaimButton } from "../../telemetry";

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export const HamburgerMenu = ({ anchorEl, setAnchorEl }: Props) => {
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);
  const accountId = useAppSelector(getAccountId);
  const displayAsTokenValue = useAppSelector(getDisplayAsTokenValue);
  const showDust = useAppSelector(getShowDust);

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
      {accountId && (
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleClaimAll}>
          Claim All Rewards
        </MenuItem>
      )}
      <Divider />
      <MenuItem sx={{ backgroundColor: "white" }} onClick={handleToggleDisplayValues}>
        Display Values As {displayAsTokenValue ? "USD" : "Token"}
      </MenuItem>
      <MenuItem sx={{ backgroundColor: "white" }} onClick={handleToggleShowDust}>
        {showDust ? "Hide" : "Show"} Dust
      </MenuItem>
      <Divider />
      {accountId && (
        <MenuItem sx={{ backgroundColor: "white" }} onClick={handleLogout}>
          Log Out
        </MenuItem>
      )}
    </Menu>
  );
};
