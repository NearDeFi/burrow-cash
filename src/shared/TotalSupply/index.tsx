import { Button } from '@mui/material';
//@ts-ignore
import MobileBottomBackground from "../../assets/mobile-bottom.png";
import { colors } from '../../style';

const TotalSupply = () => {

	return (
		<div style={{ paddingTop: "1em", textAlign: "center", height: "8em", backgroundSize: "cover", backgroundImage: `url(${MobileBottomBackground})` }}>
			<Button variant="contained" size="large" style={{ height: '6em', width: '14em', backgroundColor: colors.secondary}}>
				{'Total Supply'}
				<br />{'10,000,000$'}
			</Button>
		</div>
	)
}

export default TotalSupply;