import { Avatar } from "@mui/material";
import NearLogo from "./near.svg";

interface TokenIconProps {
	icon?: string;
}

const TokenIcon = (props: TokenIconProps) => {
	return props.icon ? (
		<Avatar src={props.icon} />
	) : (
		<Avatar sx={{ bgcolor: "#000" }}>
			<NearLogo style={{ padding: "6px", filter: "invert(100%)" }} />
		</Avatar>
	);
};

export default TokenIcon;
