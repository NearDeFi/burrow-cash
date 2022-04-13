import { Box, useTheme, IconButton, useMediaQuery } from "@mui/material";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleToggle = () => {
    trackSlimStats({ slimStats });
    dispatch(toggleSlimStats());
  };

  const ml = ["0.5rem", "1rem", "-1.5rem"];
  const mt = ["-2.5rem", "-2rem", "1.5rem"];
  if (!isMobile) {
    ml[2] = "-4rem";
    mt[2] = "0.5rem";
  }

  console.log(ml);

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
