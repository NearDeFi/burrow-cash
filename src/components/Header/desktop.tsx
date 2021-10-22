import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { useHistory } from "react-router";
import Logo from "../../assets/logo.svg";
import { Burrow, IBurrow } from "../../index";
import { colors } from "../../style";
import { login, logout } from "../../utils";
import * as SC from "./style";

interface DesktpoButtonInput {
	onClick: any;
	border: boolean;
	text: string;
}

const DesktpoButton = (props: DesktpoButtonInput) => {
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
	const burrow = useContext<IBurrow | null>(Burrow);
	const history = useHistory();

	const LeftSide = () => {
		return (
			<SC.DesktopHeaderLeftSideWrapper>
				<Typography variant="h6" component="div" style={{ color: "#00BACF" }}>
					<Logo />
				</Typography>
				<DesktpoButton
					text="Supply"
					border={history.location.pathname === "/supply"}
					onClick={() => history.push("/supply")}
				/>
				<DesktpoButton
					text="Borrow"
					border={history.location.pathname === "/borrow"}
					onClick={() => history.push("/borrow")}
				/>
				<DesktpoButton
					text="Portfolio"
					border={history.location.pathname === "/portfolio"}
					onClick={() => history.push("/portfolio")}
				/>
			</SC.DesktopHeaderLeftSideWrapper>
		);
	};

	const WalletButton = () => {
		return (
			<Button
				size="small"
				style={{ justifySelf: "end" }}
				variant="contained"
				onClick={() => {
					burrow?.walletConnection.isSignedIn()
						? logout(burrow!.walletConnection)
						: login(burrow!.walletConnection);
				}}
			>
				{burrow?.walletConnection.isSignedIn() ? burrow?.account.accountId : "Connect"}
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
