import { Box, Skeleton } from "@mui/material";

import { Wrapper, Title, Value, Subtitle } from "./style";

interface Props {
  value: number | null;
}

const HealthFactorBox = ({ value }: Props) => {
  const healthFactorDisplayValue =
    value === -1 || value === null
      ? "N/A"
      : `${value?.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
  const healthFactorColor =
    value === -1 || value === null
      ? "green"
      : value < 180
      ? "red"
      : value < 200
      ? "orange"
      : "green";

  const subtitle =
    value === -1 || value === null ? (
      <>&nbsp;</>
    ) : value < 180 ? (
      "Low"
    ) : value < 200 ? (
      "Medium"
    ) : (
      "Good"
    );

  return (
    <Wrapper>
      <Title>Health Factor</Title>
      <Box display="flex" alignItems="center">
        {value === null ? (
          <Skeleton sx={{ bgcolor: "gray" }} width={60} height={32} />
        ) : (
          <>
            <Box
              bgcolor={healthFactorColor}
              width="1rem"
              height="1rem"
              mr="0.5rem"
              borderRadius="1rem"
              component="div"
            />
            <Value>{healthFactorDisplayValue}</Value>
          </>
        )}
      </Box>
      <Subtitle>{subtitle}</Subtitle>
    </Wrapper>
  );
};

export default HealthFactorBox;
