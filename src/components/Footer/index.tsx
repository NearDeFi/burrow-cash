import { Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import useMobileDetect from "use-mobile-detect-hook";
import Logo from "../../assets/logo.svg";

const DesktopFooter = () => {
	return (
		<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
			<div style={{ gridRow: 1, display: "flex", gap: "1em" }}>
				<Typography variant="h6" style={{ color: "#00BACF", display: "inline" }}>
					<Logo />
				</Typography>
				<Typography variant="h6" style={{ color: "#000741", display: "inline" }}>
					© 2021 All Rights Reserved.
				</Typography>
			</div>
			<div style={{ gridRow: 1, justifySelf: "end" }}>
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
		<div style={{ display: "grid", gap: "2em" }}>
			<div style={{ gridRow: 1, display: "flex", justifyContent: "space-between" }}>
				<Typography variant="h6" style={{ color: "#00BACF", display: "inline" }}>
					<Logo />
				</Typography>
				<Typography variant="h6" style={{ color: "#000741", display: "inline" }}>
					© 2021 All Rights Reserved.
				</Typography>
			</div>

			<div style={{ gridRow: 2, display: "flex", justifyContent: "center", gap: "1em" }}>
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
