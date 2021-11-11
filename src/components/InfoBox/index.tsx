import { Wrapper, Title, Value, Subtitle } from "./style";

interface Props {
  title: string;
  value: string | undefined;
  subtitle?: string;
}

const InfoBox = ({ title, value = "---", subtitle }: Props): JSX.Element => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Value>{value}</Value>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Wrapper>
  );
};

export default InfoBox;
