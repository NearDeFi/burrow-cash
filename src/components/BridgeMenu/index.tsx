import { Divider, MenuItem } from "@mui/material";

const BridgeMenu = ({ onDone }) => {
  const handleClick = (url) => {
    window.open(url);
    onDone();
  };

  return (
    <>
      <Divider />
      <MenuItem onClick={() => handleClick("https://rainbowbridge.app/")}>Rainbow Bridge</MenuItem>
      <MenuItem onClick={() => handleClick("https://app.allbridge.io/")}>Allbridge</MenuItem>
    </>
  );
};

export default BridgeMenu;
