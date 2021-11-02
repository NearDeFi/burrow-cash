import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { useHistory } from "react-router";
import Logo from "../../assets/logo.svg";
import { Burrow } from "../../index";
import { colors } from "../../style";
import { login, logout } from "../../utils";
import * as SC from "./style";
import { IBurrow } from "../../interfaces/burrow";

interface DesktopButtonInput {
	onClick: any;
	border: boolean;
	text: string;
}

const DesktopButton = (props: DesktopButtonInput) => {
	const { onClick, border, text, ...other } = props;
	const notSelectedButtonStyle = {
		borderWidth: 0,
		color: colors.secondary,
	};
	const selectedButtonStyle = {
		borderWidth: 0,
		borderBottomWidth: "1px",
		borderRadius: 0,
		color: colors.secondary,
	};
	const style = border ? selectedButtonStyle : notSelectedButtonStyle;

	return (
		<Button size="medium" style={style} variant="outlined" onClick={onClick} {...other}>
			{text}
		</Button>
	);
};

const DesktopHeader = ({ children }: { children: React.ReactChild }) => {
	const { walletConnection, account } = useContext<IBurrow>(Burrow);
	const history = useHistory();

	const LeftSide = () => {
		return (
			<SC.DesktopHeaderLeftSideWrapper>
				<Typography variant="h6" component="div" style={{ color: "#00BACF" }}>
					<Logo />
				</Typography>
				<DesktopButton
					text="Supply"
					border={history.location.pathname === "/supply"}
					onClick={() => history.push("/supply")}
				/>
				<DesktopButton
					text="Borrow"
					border={history.location.pathname === "/borrow"}
					onClick={() => history.push("/borrow")}
				/>
				{walletConnection.isSignedIn() && (
					<DesktopButton
						text="Portfolio"
						border={history.location.pathname === "/portfolio"}
						onClick={() => history.push("/portfolio")}
					/>
				)}
			</SC.DesktopHeaderLeftSideWrapper>
		);
	};

	const WalletButton = () => {
		return (
			<Button
				size="small"
				style={{ justifySelf: "end", backgroundColor: colors.primary }}
				variant="contained"
				onClick={() => {
					walletConnection.isSignedIn() ? logout(walletConnection) : login(walletConnection);
				}}
			>
				{walletConnection.isSignedIn() ? account.accountId : "Connect Wallet"}
			</Button>
		);
	};

	return (
		<SC.DesktopHeaderWrapper>
			<SC.DesktopHeaderToolbar>
				<LeftSide />
				<WalletButton />
			</SC.DesktopHeaderToolbar>
			{children}
		</SC.DesktopHeaderWrapper>
	);
};

export default DesktopHeader;
