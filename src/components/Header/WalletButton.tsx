import Button from "@mui/material/Button";
import { useContext } from "react";

import { colors } from "../../style";
import { IBurrow } from "../../interfaces/burrow";
import { Burrow } from "../../index";
import { login, logout } from "../../utils";

const WalletButton = () => {
	const { walletConnection, account } = useContext<IBurrow>(Burrow);

	const onWalletButtonClick = () => {
		if (walletConnection.isSignedIn()) {
			logout(walletConnection);
		} else {
			login(walletConnection);
		}
	};

	return (
		<Button
			size="small"
			style={{ justifySelf: "end", backgroundColor: colors.primary }}
			variant="contained"
			onClick={onWalletButtonClick}
		>
			{walletConnection.isSignedIn() ? account.accountId : "Connect Wallet"}
		</Button>
	);
};

export default WalletButton;
