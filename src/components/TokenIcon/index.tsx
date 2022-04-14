import { Avatar, SvgIcon } from "@mui/material";
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
    <SvgIcon
      style={{ width, height, filter: "invert(100%)" }}
      viewBox="0 0 35 35"
      component={NearLogo}
    />
  );
};

export default TokenIcon;
