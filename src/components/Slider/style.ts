import { styled } from "@mui/material/styles";
import { Slider } from "@mui/material";

export const SliderStyled = styled(Slider)(({ theme }) => ({
  color: theme.palette.secondary.main,
  height: 2,
  "& .MuiSlider-thumb": {
    height: 14,
    width: 14,
    color: theme.palette.primary.main,
  },
  "& .MuiSlider-track": {
    height: 1,
    color: theme.palette.primary.main,
  },
  "& .MuiSlider-rail": {
    color: "#DADADA",
    height: 3,
    opacity: 1,
  },
  "& .MuiSlider-mark": {
    color: "#DADADA",
    height: 14,
    width: 14,
    borderRadius: 14,
    marginLeft: "-6px",
    "&.MuiSlider-markActive": {
      opacity: 1,
      backgroundColor: theme.palette.primary.main,
    },
  },
  "& .MuiSlider-markLabel": {
    fontWeight: "bold",
    color: "#DADADA",
    '&[data-index="0"]': {
      marginLeft: "5px",
    },
  },
}));
