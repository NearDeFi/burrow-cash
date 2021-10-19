import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import * as React from "react";
import useMobileDetect from "use-mobile-detect-hook";
import { CloseModalIcon } from "./components";
import { BorrowData, TokenActionsTemplate } from "./templates";
import { Templates } from "./types";

interface ModalState {
	setModalType: (i: string) => void;
	handleOpen: () => void;
	setTemplate: (i: Templates) => void;
}

export const ModalContext = React.createContext<ModalState>({} as ModalState);

const ModalData: any = {
	borrow: BorrowData,
};

const ModalContainer = ({ children }: { children: React.ReactElement }) => {
	const detectMobile = useMobileDetect();
	const style = detectMobile.isMobile() ? mobileStyle : desktopStyle;
	const [modalType, setModalType] = React.useState<string>("borrow");
	const [template, setTemplate] = React.useState<Templates>(Templates.TokenActions);
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const modalData = ModalData[modalType];

	const state: ModalState = {
		setModalType,
		handleOpen,
		setTemplate,
	};

	return (
		<ModalContext.Provider value={state}>
			<Modal open={open} onClose={handleClose}>
				<Box sx={style}>
					<CloseModalIcon closeModal={handleClose} />
					{template === Templates.TokenActions && (
						<TokenActionsTemplate
							title={modalData.title}
							token={modalData.token}
							totalAmount={modalData.totalAmount}
							totalAmountTitle={modalData.totalAmountTitle}
							buttonText={modalData.buttonText}
							rates={modalData.rates}
							ratesTitle={modalData.ratesTitle}
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
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	padding: "0.6em",
	paddingLeft: 0,
	bgcolor: "background.paper",
	boxShadow: 24,
	width: '448px'
};

export default ModalContainer;
