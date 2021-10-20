import styled from "styled-components";

export const DesktopFooterWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	width: 100%;
`;

export const DesktopFooterRightSideWrapper = styled.div`
	justify-self: end;
	padding-right: 1em;
`;

export const DesktopFooterLeftSideWrapper = styled.div`
	display: flex;
	gap: 1em;
	padding-left: 1em;
`;
export const MobileFooterWrapper = styled.div`
	display: grid;
	gap: 1em;
	padding: 0.5em;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
`;

export const MobileFooterRightSideWrapper = styled.div`
	font-size: 12px;
	font-weight: 500;
	grid-row: 2;
	display: flex;
	justify-content: center;
	gap: 1em;
`;

export const MobileFooterLeftSideWrapper = styled.div`
	grid-row: 1;
	display: inline-grid;
	justify-content: space-around;
`;
