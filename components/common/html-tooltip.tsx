import { Tooltip, styled, TooltipProps, tooltipClasses } from "@mui/material";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip placement="top-start" {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.default,
    boxShadow: "0px 2px 4px rgba(0, 7, 65, 0.2)",
    borderColor: "rgba(0, 7, 65, 0.2)",
    color: theme.palette.secondary.main,
    borderWidth: 0.5,
    borderStyle: "solid",
    padding: "1rem",
  },
}));

export default HtmlTooltip;
