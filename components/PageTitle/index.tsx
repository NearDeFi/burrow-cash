import { Box, useTheme } from "@mui/material";

const PageTitle = ({ first, second }: { first: string; second: string }) => {
  const theme = useTheme();
  return (
    <Box textAlign="left" mt="1rem" mb="2rem" ml="1.4rem" fontSize="1.5rem" fontWeight="500">
      <span style={{ color: theme.palette.primary.main }}>{first}</span>{" "}
      <span style={{ color: theme.custom.text }}>{second}</span>
    </Box>
  );
};

export default PageTitle;
