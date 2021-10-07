
import { Theme } from '@mui/material/styles';

export const styles = (theme: Theme) =>
({
	borderlessFlexContainer: {
		display: 'flex',
		alignItems: 'center',
	},
	headerFlexContainer: {
		display: 'flex',
		// alignItems: 'center',
		boxSizing: 'border-box',
	},
	flexContainer: {
		display: 'flex',
		alignItems: 'center',
		boxSizing: 'border-box',
	},
	table: {
		// temporary right-to-left patch, waiting for
		// https://github.com/bvaughn/react-virtualized/issues/454
		'& .ReactVirtualized__Table__headerRow': {
			...(theme.direction === 'rtl' && {
				paddingLeft: '0 !important',
			}),
			...(theme.direction !== 'rtl' && {
				paddingRight: undefined,
			}),
		},
	},
	tableRow: {
		cursor: 'pointer',
	},
	tableRowHover: {
		'&:hover': {
			backgroundColor: 'white'
		},
	},
	tableCell: {
		flex: 1,
	},
	noClick: {
		cursor: 'initial',
	},
} as const);
