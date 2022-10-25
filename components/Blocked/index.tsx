import { Grid, Modal, Typography, Link } from "@mui/material";

export default function Blocked() {
  return (
    <Modal open>
      <Grid container direction="column" justifyContent="center" alignItems="center" height="100vh">
        <Grid
          item
          bgcolor="white"
          p="2rem"
          m="2rem"
          borderRadius="0.5rem"
          width={{ small: "100%", md: "400px" }}
        >
          <Typography variant="h4" component="h4">
            Woops!
          </Typography>
          <Typography mt="1rem">
            Use of burrow.cash is not available to people or companies who are residents of, or are
            located, incorporated, or have a registered agent in, the United States or a restricted
            territory. VPNs are also blocked. For more information, please see the{" "}
            <Link
              href="https://github.com/NearDeFi/burrow-cash/blob/main/DECLARATION.md"
              target="_blank"
            >
              Declaration and Disclaimers
            </Link>
            .
          </Typography>
        </Grid>
      </Grid>
    </Modal>
  );
}
