import { Avatar } from "@mui/material";
import NearLogo from "./near.svg";

interface TokenIconProps {
  icon?: string;
}

const TokenIcon = (props: TokenIconProps) => {
  const { icon } = props;
  return icon ? (
    <Avatar src={icon} sx={{ width: 35, height: 35 }} />
  ) : (
    <Avatar sx={{ bgcolor: "#000", width: 35, height: 35 }}>
      <NearLogo style={{ padding: "6px", filter: "invert(100%)" }} />
    </Avatar>
  );
};

export default TokenIcon;
