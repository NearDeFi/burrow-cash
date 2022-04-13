import { Box, useTheme, IconButton } from "@mui/material";
import { AiFillCaretDown } from "@react-icons/all-files/ai/AiFillCaretDown";
import { AiFillCaretUp } from "@react-icons/all-files/ai/AiFillCaretUp";

import { toggleSlimStats } from "../../redux/appSlice";
import { getSlimStats } from "../../redux/appSelectors";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { trackSlimStats } from "../../telemetry";

export const ToggleSlimBanner = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const slimStats = useAppSelector(getSlimStats);

  const handleToggle = () => {
    trackSlimStats({ slimStats });
    dispatch(toggleSlimStats());
  };

  const ml = ["1.5rem", "1.5rem", "-1.5rem"];
  const mt = ["-2.5rem", "-1.2rem", "1.5rem"];

  return (
    <Box position="absolute" ml={ml} mt={mt}>
      <IconButton onClick={handleToggle}>
        {slimStats ? (
          <AiFillCaretDown size={32} color={theme.palette.primary.main} />
        ) : (
          <AiFillCaretUp size={32} color={theme.palette.primary.main} />
        )}
      </IconButton>
    </Box>
  );
};
