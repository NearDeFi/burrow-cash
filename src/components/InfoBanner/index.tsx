import { Box, useTheme, useMediaQuery } from "@mui/material";

import { Rewards } from "./rewards";
import { UserTotals, UserHealth } from "./user";
import { Totals } from "./totals";
import { ToggleSlimBanner } from "./toggle";
import { Wrapper } from "./style";

const InfoBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const areas = [
    `"totals" "user" "rewards"`,
    `"totals" "user" "rewards"`,
    `"totals user" "health rewards"`,
    `"totals user health" ". rewards ."`,
    `"totals user health rewards"`,
  ];
  const columns = [
    "1fr",
    "1fr",
    "repeat(2, minmax(320px, 320px))",
    "repeat(3, minmax(320px, 320px))",
    "repeat(4, minmax(320px, 320px))",
  ];
  return (
    <Box>
      <ToggleSlimBanner />
      <Box
        display="grid"
        gridTemplateAreas={areas}
        gridTemplateColumns={columns}
        gap={2}
        mx="2rem"
        my="1rem"
      >
        <Totals />
        {isMobile ? (
          <Wrapper gridArea="user" sx={{ flexDirection: "column" }}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <UserTotals />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%">
              <UserHealth />
            </Box>
          </Wrapper>
        ) : (
          <>
            <Wrapper gridArea="user">
              <UserTotals />
            </Wrapper>
            <Wrapper gridArea="health">
              <UserHealth />
            </Wrapper>
          </>
        )}
        <Rewards />
      </Box>
    </Box>
  );
};

export default InfoBanner;
