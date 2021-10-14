import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
//@ts-ignore
import useMobileDetect from "use-mobile-detect-hook";
//@ts-ignore
import TopBackground from "../../assets/desktop-top-background.jpg";
//@ts-ignore
import Logo from "../../assets/logo.svg";
//@ts-ignore
import mobileBG from "../../assets/mobile-background.jpg";
import { ViewMethodsLogic } from "../../config";
import { Burrow, IBurrow } from "../../index";
import { colors } from "../../style";
import { login, logout } from "../../utils";

const MobileHeader = () => {
	const burrow = useContext<IBurrow | null>(Burrow);
	const [oracle, setOracle] = useState<string>("");
	const [owner, setOwner] = useState<string>("");

	useEffect(() => {
		(async () => {
			const config = await burrow?.view(
				burrow?.logicContract,
				ViewMethodsLogic[ViewMethodsLogic.get_config],
			);
			setOracle(config.oracle_account_id);
			setOwner(config.owner_id);
		})();
	}, []);

	return (
		<div style={{ minHeight: "9em", backgroundSize: "cover", backgroundImage: `url(${mobileBG})` }}>
			<Toolbar>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						width: "100%",
					}}
				>
					<div>
						<Typography variant="h6" component="div" style={{ color: "#00BACF" }}>
							<Logo />
						</Typography>
					</div>
					<div style={{ justifySelf: "end" }}>
						<Button
							size="small"
							variant="contained"
							style={{ backgroundColor: colors.primary }}
							onClick={() => {
								burrow?.walletConnection.isSignedIn()
									? logout(burrow!.walletConnection)
									: login(burrow!.walletConnection);
							}}
						>
							{burrow?.walletConnection.isSignedIn() ? "Disconnect" : "Connect"}
						</Button>
					</div>
				</div>
			</Toolbar>
			<MobileSubHeader />
		</div>
	);
};

const DesktopSubHeaderButton = ({
	border,
	onClick,
	text,
}: {
	onClick: any;
	border: boolean;
	text: string;
}) => {
	const style = border
		? {
				borderWidth: "0",
				borderBottomWidth: "1px",
				borderRadius: "0",
				color: "#000741",
		  }
		: { borderWidth: "0", color: "#000741" };

	return (
		<Button size="small" variant="outlined" style={style} onClick={onClick}>
			{text}
		</Button>
	);
};

const MobileSubHeaderButton = ({
	border,
	onClick,
	text,
}: {
	onClick: any;
	border: boolean;
	text: string;
}) => {
	const style = border
		? {
				borderWidth: "0",
				borderBottomWidth: "2px",
				borderRadius: "0",
				color: colors.secondary,
				fontWeight: "700",
				borderColor: colors.primary,
		  }
		: {
				borderWidth: "0",
				color: "#000741",
				fontWeight: "700",
		  };

	return (
		<Button size="medium" variant="outlined" style={style} onClick={onClick}>
			{text}
		</Button>
	);
};

const MobileSubHeader = () => {
	const history = useHistory();

	return (
		<Toolbar>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr",
					width: "100%",
					justifyContent: "center",
					gridGap: "1em",
				}}
			>
				<div style={{ justifySelf: "end" }}>
					<MobileSubHeaderButton
						text="Supply"
						border={history.location.pathname === "/supply"}
						onClick={() => history.push("/supply")}
					/>
				</div>
				<div style={{ justifySelf: "center" }}>
					<MobileSubHeaderButton
						text="Borrow"
						border={history.location.pathname === "/borrow"}
						onClick={() => history.push("/borrow")}
					/>
				</div>
				<div style={{ justifySelf: "start" }}>
					<MobileSubHeaderButton
						text="Portfolio"
						border={history.location.pathname === "/portfolio"}
						onClick={() => history.push("/portfolio")}
					/>
				</div>
			</div>
		</Toolbar>
	);
};

const StyledToolbar = styled(Toolbar)`
	min-height: 5em !important;
`;

const DesktopHeader = ({ children }) => {
	const burrow = useContext<IBurrow | null>(Burrow);
	const [oracle, setOracle] = useState<string>("");
	const [owner, setOwner] = useState<string>("");
	const history = useHistory();

	useEffect(() => {
		(async () => {
			const config = await burrow?.view(
				burrow?.logicContract,
				ViewMethodsLogic[ViewMethodsLogic.get_config],
			);
			setOracle(config.oracle_account_id);
			setOwner(config.owner_id);
		})();
	}, []);

	return (
		<div
			style={{
				backgroundSize: "cover",
				backgroundImage: `url(${TopBackground})`,
				height: "23em",
			}}
		>
			<StyledToolbar>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "0.5fr 1fr",
						width: "100%",
					}}
				>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
						<Typography variant="h6" component="div" style={{ color: "#00BACF" }}>
							<Logo />
						</Typography>
						<div style={{}}>
							<DesktopSubHeaderButton
								text="Supply"
								border={history.location.pathname === "/supply"}
								onClick={() => history.push("/supply")}
							/>
						</div>
						<div style={{}}>
							<DesktopSubHeaderButton
								text="Borrow"
								border={history.location.pathname === "/borrow"}
								onClick={() => history.push("/borrow")}
							/>
						</div>
						<div style={{}}>
							<DesktopSubHeaderButton
								text="Portfolio"
								border={history.location.pathname === "/portfolio"}
								onClick={() => history.push("/portfolio")}
							/>
						</div>
					</div>
					<div style={{ justifySelf: "end" }}>
						<Button
							size="small"
							variant="contained"
							onClick={() => {
								burrow?.walletConnection.isSignedIn()
									? logout(burrow!.walletConnection)
									: login(burrow!.walletConnection);
							}}
						>
							{burrow?.walletConnection.isSignedIn() ? "Disconnect" : "Connect"}
						</Button>
					</div>
				</div>
			</StyledToolbar>
			{children}
		</div>
	);
};

const Header = ({ children }) => {
	const detectMobile = useMobileDetect();
	const isMobile = detectMobile.isMobile();
	if (isMobile) {
		return <MobileHeader />;
	} else {
		return <DesktopHeader>{children}</DesktopHeader>;
	}
};

export default Header;
