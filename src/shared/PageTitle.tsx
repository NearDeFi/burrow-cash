import styled from "styled-components";
import { colors } from "../style";

const TitleWrapper = styled.div<{ paddingTop?: string }>`
	text-align: center;
	padding-top: ${(props) => props.paddingTop || "1em"};
	font-size: 24px;
	font-weight: 500;
`;

const PageTitle = ({
	first,
	second,
	paddingTop,
}: {
	first: string;
	second: string;
	paddingTop: string;
}) => {
	return (
		<TitleWrapper paddingTop={paddingTop}>
			Available <span style={{ color: colors.primary }}>{first}</span> {second}
		</TitleWrapper>
	);
};

export default PageTitle;
