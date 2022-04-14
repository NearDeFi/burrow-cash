import { Avatar } from "@mui/material";
import NearLogo from "./near.svg";

interface TokenIconProps {
  icon?: string;
  width?: number;
  height?: number;
}

const TokenIcon = (props: TokenIconProps) => {
  const { icon, width = 35, height = 35 } = props;
  return icon ? (
    <Avatar src={icon} sx={{ width, height }} />
  ) : (
    <Avatar sx={{ bgcolor: "#000", width, height }}>
      <NearLogo style={{ filter: "invert(100%)" }} />
    </Avatar>
  );
};

export default TokenIcon;
