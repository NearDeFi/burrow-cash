import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, Button, Switch, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import * as React from 'react';
import useMobileDetect from 'use-mobile-detect-hook';
import { Input, Stepper } from '..';

const mobileStyle = {
	height: '100%',
	padding: '0.6em',
	paddingLeft: 0,
	width: '100%',
	bgcolor: 'background.paper',
	boxShadow: 24,
};

const desktopStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	padding: '0.6em',
	paddingLeft: 0,
	bgcolor: 'background.paper',
	boxShadow: 24,
};

export const ModalContext = React.createContext({});

export enum Inputs {
	String,
	Switch,
}

const createListItem = ({ title, value, valueType = Inputs.String }
	: { title: string, value: any, valueType?: Inputs }) => {
	return (
		<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: "2em", padding: "1em", paddingTop: 0 }}>
			<div>{title}</div>
			{
				valueType === Inputs.String && <div style={{ justifySelf: "end" }}>{value}</div>
			}
			{
				valueType === Inputs.Switch && <div style={{ justifySelf: "end" }}><Switch /></div>
			}
		</div>
	)
}

const ModalContainer = ({ children }: { children: React.ReactElement }) => {
	const [open, setOpen] = React.useState(true);
	const handleOpen = () => setOpen(true);
	const detectMobile = useMobileDetect();
	const style =  detectMobile.isMobile() ? mobileStyle : desktopStyle;
	const handleClose = () => setOpen(false);
	const state = {};
	const rates = [
		{value: "0.00%", title: "Deposit APY"},
		{value: "0.00%", title: "Extra Rewards APY"},
		{value: "0.00%", title: "Total APY"},
		{value: "40.00%", title: "Collateral Factor"},
		{ value: false, title: "Use as Collateral", valueType: Inputs.Switch },
	]

	return (
		<ModalContext.Provider value={state}>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div onClick={handleClose} style={{ position: "absolute", cursor: "pointer", right: "8px" }}>
						<CloseIcon />
					</div>
					<div>
						<Typography id="modal-modal-title" style={{ textAlign: "center " }} variant="h6" component="h2" sx={{ mt: 8 }}>
							Modal Title
						</Typography>
						<div style={{ display: "grid", justifyContent: "center", marginTop: "2em" }}>
							<Avatar />
						</div>
						<Typography style={{ textAlign: "center " }} id="modal-modal-description" sx={{ mt: 2 }}>
							Token Name
							<br />
							0.00$ APY
						</Typography>
					</div>
					<div style={{ display: "grid", padding: "1em", gridTemplateColumns: "1.1fr 0.9fr" }}>
						<div>Available: 0 TOKEN ($0.00)</div>
						<div style={{ justifySelf: "end" }}>1 Token = $0.00</div>
					</div>
					<div style={{ paddingLeft: "1em", paddingRight: "1em" }}>
						<Input />
					</div>
					<div style={{ paddingTop: "1em" }}>
						<Stepper />
					</div>
					<Typography style={{ textAlign: "center " }} id="modal-modal-description" sx={{ mt: 2 }}>
						Supply Amount = 0
					</Typography>
					<div style={{ padding: "1em" }}>Deposit Rates</div>
					{rates.map((r) => createListItem(r))}
					<Typography style={{ textAlign: "center " }} id="modal-modal-description" sx={{ mt: 2 }}>
					<Button variant="contained">Button Text</Button>
					</Typography>
				</Box>
			</Modal>
			{children}
		</ModalContext.Provider>
	);
}

export default ModalContainer;
