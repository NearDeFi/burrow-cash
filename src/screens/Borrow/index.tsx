import { Header, Table } from '../../components';
import { TotalSupply } from '../../shared';
import * as SC from './style';

const Borrow = () => {
	const columns = [
		{
			width: 200,
			label: 'Name',
			dataKey: 'name',
		},
		{
			width: 120,
			label: 'Borrow APY',
			dataKey: 'borrowAPY',
			numeric: true,
		},
	]
	const data = [
		{ name: "ABC", borrowAPY: 10 },
		{ name: "ABC", borrowAPY: 10 },
		{ name: "ABC", borrowAPY: 10 },
		{ name: "ABC", borrowAPY: 10 },
	]
	return (
		<>
			<Header />
				<SC.TitleWrapper>
					Available <span style={{ color: "green" }}>Borrow</span> Assets
				</SC.TitleWrapper>
			<Table rows={data} columns={columns} />
			<TotalSupply />
		</>
	)
}

export default Borrow;
