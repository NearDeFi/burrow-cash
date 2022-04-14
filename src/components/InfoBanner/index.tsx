import { Box, useTheme, useMediaQuery } from "@mui/material";

import { Rewards } from "./rewards";
import { UserTotals, UserHealth } from "./user";
import { Totals } from "./totals";
import { ToggleSlimBanner } from "./toggle";
import { Wrapper } from "./style";
import { useSlimStats } from "../../hooks";

const InfoBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const slimStats = useSlimStats();

  const areas = slimStats
    ? [
        `"totals" "user" "rewards"`,
        `"totals" "user" "rewards"`,
        `"totals user" "rewards rewards"`,
        `"totals user rewards"`,
      ]
    : [
        `"totals" "user" "rewards"`,
        `"totals" "user" "rewards"`,
        `"totals user" "health rewards"`,
        `"totals user health" ". rewards ."`,
        `"totals user health rewards"`,
      ];

  const columns = slimStats
    ? ["1fr", "1fr", "1fr 1fr", "300px 540px 300px"]
    : ["1fr", "1fr", "repeat(2, minmax(320px, 1fr))", "repeat(3, 320px)", "repeat(4, 320px)"];

  return (
    <Box mt={[0, "1rem", 0]} mb="1.5rem" mx={["1rem", "2rem"]}>
      <ToggleSlimBanner />
      <Box
        sx={{ margin: 0, borderRadius: 0 }}
        display="grid"
        gridTemplateAreas={areas}
        gridTemplateColumns={columns}
        gap={isMobile ? (slimStats ? 0 : 2) : 2}
        mx="2rem"
        my="1rem"
        pt={[0, slimStats ? "1rem" : "0.5rem", 0]}
      >
        {isMobile ? (
          <>
            <Wrapper gridArea="user" sx={{ flexDirection: "column", borderRadius: 0 }}>
              {!slimStats && (
                <>
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Totals />
                  </Box>
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <UserTotals />
                  </Box>
                </>
              )}
              <Box display="flex" justifyContent="space-between" width="100%">
                <UserHealth />
              </Box>
            </Wrapper>
            {!slimStats && <Rewards />}
          </>
        ) : (
          <>
            <Wrapper gridArea="totals">
              <Totals />
            </Wrapper>
            {slimStats ? (
              <Wrapper gridArea="user">
                <UserTotals />
                <UserHealth />
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
          </>
        )}
      </Box>
    </Box>
  );
};

export default InfoBanner;
