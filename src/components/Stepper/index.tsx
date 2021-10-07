import Check from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 10,
		left: 'calc(-50% + 7.5px)',
		right: 'calc(50% + 7.5px)',
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: '#784af4',
		},
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: '#784af4',
		},
	},
	[`& .${stepConnectorClasses.line}`]: {
		borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#784af4',
		borderTopWidth: 3,
		borderRadius: 1,
	},
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
	({ theme, ownerState }) => ({
		color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : 'green',
		display: 'flex',
		height: 24,
		alignItems: 'center',
		...(ownerState.active && {
			color: '#784af4',
		}),
		'& .QontoStepIcon-completedIcon': {
			width: 16,
			height: 16,
			borderRadius: '50%',
			backgroundColor: 'green',
		},
		'& .QontoStepIcon-circle': {
			width: 16,
			height: 16,
			borderRadius: '50%',
			backgroundColor: '#784af4',
		},
	}),
);

function QontoStepIcon(props: StepIconProps) {
	const { active, completed, className } = props;

	return (
		<QontoStepIconRoot ownerState={{ active }} className={className}>
			{completed ? (
				<Check className="QontoStepIcon-completedIcon" />
			) : (
				<div className="QontoStepIcon-circle" />
			)}
		</QontoStepIconRoot>
	);
}

const steps = ['0%', '25%', '50%', '75%', '100%'];

export default function CustomizedSteppers() {
	return (
		<Stack sx={{ width: '100%' }}>
			<Stepper alternativeLabel activeStep={1} connector={<QontoConnector />}>
				{steps.map((label) => (
					<Step key={label} style={{padding: 0}}>
						<StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
		</Stack>
	);
}
