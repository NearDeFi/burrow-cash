import Typography from "@mui/material/Typography";
//@ts-ignore
import Logo from "../../assets/logo.svg";
import { Divider, Grid } from "@mui/material"

const SubFooter = () => {
  //@ts-ignore
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography
          variant="h6"
          component="div"
          style={{ color: "#00BACF", display: "inline" }}>
          <Logo/>
        </Typography>
        <Typography style={{ color: "#000741", display: "inline" }}>
          © 2021 All Rights Reserved.
        </Typography>
      </Grid>

      <Grid item xs={6} justifyContent={"flex-end"}>
        <Typography>
          Terms of Service
        </Typography>
        <Divider orientation={"vertical"} flexItem/>
        <Typography>
          Privacy Policy
        </Typography>
      </Grid>
    </Grid>
  );
};

const Footer = () => {
  return (
    <>
      <SubFooter/>
    </>
  )
}

export default Footer;
