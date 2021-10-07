import { Button } from '@mui/material';
import { Header, Table } from '../../components';
import * as SC from './style';

const Supply = () => {
	const columns = [
		{
			width: 120,
			label: 'Name',
			dataKey: 'name',
		},
		{
			width: 120,
			label: 'APY',
			dataKey: 'apy',
			numeric: false,
		},
		{
			width: 120,
			label: 'Collateral',
			dataKey: 'collateral',
			numeric: false,
		},
	]
	const data = [
		{ name: "ABC", apy: 10, collateral: false },
		{ name: "ABC", apy: 10, collateral: true },
		{ name: "ABC", apy: 10, collateral: false },
		{ name: "ABC", apy: 10, collateral: false },
	]
	return (
		<>
			<Header />
			<SC.TitleWrapper>
				Available <span style={{ color: "green" }}>Supply</span> Assets
			</SC.TitleWrapper>
			<Table rows={data} columns={columns} />
			<div style={{ paddingTop: "1em", textAlign: "center", height: "8em" }}>
				<Button variant="contained" size="large" style={{ height: '6em', width: '14em' }}>
					{' Total Supply '}
					<br />{' 10,000,000$ '}
				</Button>
			</div>
		</>
	)
}

export default Supply;