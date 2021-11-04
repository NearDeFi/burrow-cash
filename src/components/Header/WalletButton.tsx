import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";

import { colors } from "../../style";
import { IBurrow } from "../../interfaces/burrow";
import { Burrow } from "../../index";
import { login, logout } from "../../utils";

const WalletButton = () => {
	const { walletConnection, account } = useContext<IBurrow>(Burrow);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const onWalletButtonClick = (event) => {
		if (!walletConnection.isSignedIn()) {
			login(walletConnection);
		} else {
			setAnchorEl(event.currentTarget);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Button
				size="small"
				style={{ justifySelf: "end", backgroundColor: colors.primary }}
				variant="contained"
				onClick={onWalletButtonClick}
			>
				{walletConnection.isSignedIn() ? account.accountId : "Connect Wallet"}
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
				<MenuItem sx={{ backgroundColor: "white" }} onClick={() => logout(walletConnection)}>
					Log Out
				</MenuItem>
			</Menu>
		</div>
	);
};

export default WalletButton;
