import { Box, useTheme } from "@mui/material";

const PageTitle = ({ first, second }: { first: string; second: string }) => {
  const theme = useTheme();
  return (
    <Box textAlign="center" mt="1rem" mb="3rem" fontSize="1.5rem" fontWeight="500">
      <span style={{ color: theme.palette.primary.main }}>{first}</span> {second}
    </Box>
  );
};

export default PageTitle;
