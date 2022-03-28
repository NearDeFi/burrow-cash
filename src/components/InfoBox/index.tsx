import { Skeleton } from "@mui/material";

import { Wrapper, Title, Value, Subtitle } from "./style";

interface Props {
  title: string;
  value: string | undefined;
  subtitle?: string;
}

const InfoBox = ({ title, value, subtitle }: Props): JSX.Element => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      {value ? (
        <Value>{value}</Value>
      ) : (
        <Skeleton sx={{ bgcolor: "gray" }} width={100} height={32} />
      )}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Wrapper>
  );
};

export default InfoBox;
