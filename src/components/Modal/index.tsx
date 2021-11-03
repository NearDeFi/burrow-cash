import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import * as React from "react";
// @ts-ignore
import useMobileDetect from "use-mobile-detect-hook";
import { CloseModalIcon } from "./components";
import { BorrowData, TokenActionsTemplate } from "./templates";
import { Templates, TokenActionsInput } from "./types";

export interface ModalState {
	handleOpen: () => void;
	setTemplate: (i: Templates) => void;
	setModalData: (i: TokenActionsInput) => void;
}

export const ModalContext = React.createContext<ModalState>({} as ModalState);

const ModalContainer = ({ children }: { children: React.ReactElement }) => {
	const detectMobile = useMobileDetect();
	const style = detectMobile.isMobile() ? mobileStyle : desktopStyle;
	const [template, setTemplate] = React.useState<Templates>(Templates.TokenActions);
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [modalData, setModalData] = React.useState<TokenActionsInput>(BorrowData);

	const state: ModalState = {
		handleOpen,
		setTemplate,
		setModalData,
	};

	return (
		<ModalContext.Provider value={state}>
			<Modal open={open} onClose={handleClose}>
				<Box sx={style}>
					<CloseModalIcon closeModal={handleClose} />
					{template === Templates.TokenActions && (
						<TokenActionsTemplate
							title={modalData.title}
							type={modalData.type}
							asset={modalData.asset}
							totalAmountTitle={modalData.totalAmountTitle}
							buttonText={`${modalData.type} ${modalData.asset.symbol}`}
							rates={modalData.rates}
							ratesTitle={`${modalData.type} ${modalData.ratesTitle}`}
						/>
					)}
				</Box>
			</Modal>
			{children}
		</ModalContext.Provider>
	);
};

const mobileStyle = {
	height: "100%",
	padding: "0.6em",
	paddingLeft: 0,
	width: "100%",
	bgcolor: "background.paper",
	boxShadow: 24,
};

const desktopStyle = {
	position: "absolute" as const,
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	padding: "0.6em",
	paddingLeft: 0,
	bgcolor: "background.paper",
	boxShadow: 24,
	width: "448px",
};

export default ModalContainer;
