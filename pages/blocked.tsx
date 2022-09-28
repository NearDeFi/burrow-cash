import { Grid } from "@mui/material";

export default function Blocked() {
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" height="100vh">
      <Grid item>
        <h3>Sorry your region is blocked</h3>
      </Grid>
    </Grid>
  );
}
