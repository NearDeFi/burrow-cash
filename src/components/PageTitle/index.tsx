import styled from "styled-components";

import { colors } from "../../style";

const TitleWrapper = styled.div`
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 3rem;
  font-size: 24px;
  font-weight: 500;
`;

const PageTitle = ({ first, second }: { first: string; second: string }) => {
  return (
    <TitleWrapper>
      Available <span style={{ color: colors.primary }}>{first}</span> {second}
    </TitleWrapper>
  );
};

export default PageTitle;
