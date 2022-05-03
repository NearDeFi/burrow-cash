import { Box, Tooltip } from "@mui/material";
import { useState } from "react";
import { FcInfo } from "@react-icons/all-files/fc/FcInfo";

const Label = ({ name, title }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleOpenTooltip = (e) => {
    setShowTooltip(true);
    e.stopPropagation();
  };

  return (
    <Tooltip
      title={title}
      open={showTooltip}
      onOpen={() => setShowTooltip(true)}
      onClose={() => setShowTooltip(false)}
    >
      <Box>
        {name} <FcInfo onClick={handleOpenTooltip} />
      </Box>
    </Tooltip>
  );
};

export default Label;
