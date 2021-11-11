import { Avatar } from "@mui/material";
import NearLogo from "./near.svg";

interface TokenIconProps {
  icon?: string;
}

const TokenIcon = (props: TokenIconProps) => {
  const { icon } = props;
  return icon ? (
    <Avatar src={icon} />
  ) : (
    <Avatar sx={{ bgcolor: "#000" }}>
      <NearLogo style={{ padding: "6px", filter: "invert(100%)" }} />
    </Avatar>
  );
};

export default TokenIcon;
