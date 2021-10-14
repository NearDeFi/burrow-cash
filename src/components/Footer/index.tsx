import { Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
//@ts-ignore
import useMobileDetect from "use-mobile-detect-hook";
//@ts-ignore
import Logo from "../../assets/logo.svg";

const DesktopFooter = () => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				width: "100%",
			}}
		>
			<div style={{ gridRow: 1, display: "flex", gap: "1em", marginLeft: "2em" }}>
				<Typography variant="h6" style={{ color: "#00BACF", display: "inline" }}>
					<Logo />
				</Typography>
				<Typography variant="h6" style={{ color: "#000741", display: "inline" }}>
					© 2021 All Rights Reserved.
				</Typography>
			</div>
			<div style={{ gridRow: 1, justifySelf: "end", marginRight: "2em" }}>
				<Typography variant="h6">
					<span style={{ cursor: "pointer" }}>Terms of Service</span> |{" "}
					<span style={{ cursor: "pointer" }}>Privacy Policy</span>
				</Typography>
			</div>
		</div>
	);
};

const MobileFooter = () => {
	return (
		<div
			style={{
				display: "grid",
				gap: "1em",
				padding: "0.5em",
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
			}}
		>
			<div style={{ gridRow: 1, display: "inline-grid", justifyContent: "space-around" }}>
				<Typography variant="h6" style={{ color: "#00BACF", gridRow: 1 }}>
					<Logo />
				</Typography>
				<Typography
					variant="h6"
					style={{ gridRow: 1, fontSize: "12px", fontWeight: 500, color: "#000741" }}
				>
					© 2021 All Rights Reserved.
				</Typography>
			</div>

			<div
				style={{
					fontSize: "12px",
					fontWeight: 500,
					gridRow: 2,
					display: "flex",
					justifyContent: "center",
					gap: "1em",
				}}
			>
				<Typography>Terms of Service</Typography>
				<Divider orientation={"vertical"} flexItem />
				<Typography>Privacy Policy</Typography>
			</div>
		</div>
	);
};

const Footer = () => {
	const detectMobile = useMobileDetect();

	return detectMobile.isMobile() ? <MobileFooter /> : <DesktopFooter />;
};

export default Footer;
