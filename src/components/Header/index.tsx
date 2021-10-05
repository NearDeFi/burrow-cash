import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router";
import { login, logout } from "../../utils";
//@ts-ignore
import Logo from "./logo.svg";

const TopHeader = () => {
	//@ts-ignore
	const { walletConnection } = window;

	return (
		<Toolbar>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", width: "100%" }}>
				<div>
					<Typography
						variant="h6"
						component="div"
						style={{ color: "#00BACF" }}>
							<Logo />
					</Typography>
				</div>
				<div style={{ justifySelf: "end" }}>
					<Button size="small" variant="contained" onClick={walletConnection.isSignedIn() ? logout : login}>
						{walletConnection.isSignedIn() ? "Disconnect" : "Connect"}
					</Button>
				</div>
			</div>
		</Toolbar>
	);
};


const SubHeaderButton = ({ border, onClick, text }: { onClick: any, border: boolean, text: string }) => {
	const style = border ?
		{ borderWidth: "0", borderBottomWidth: "1px", borderRadius: "0", color: "#000741" }
		: { borderWidth: "0", color: "#000741" };

	return (
		<Button
			size="medium"
			variant="outlined"
			style={style}
			onClick={onClick}>
		{text}	
		</Button>
	)
}

const SubHeader = () => {
	const history = useHistory();

	return (
		<Toolbar>
			<div style={{ 
				display: "grid", 
				gridTemplateColumns: "1fr 1fr 1fr", 
				width: "100%", 
				paddingRight: "1em", 
				justifyContent: "center",
				gridGap: "1em"
			}}>
				<div style={{ justifySelf: "end" }}>
					<SubHeaderButton 
						text="Supply" 
						border={history.location.pathname === "/supply"} 
						onClick={() => history.push("/supply")} />
				</div>
				<div style={{ justifySelf: "center" }}>
					<SubHeaderButton 
						text="Borrow" 
						border={history.location.pathname === "/borrow"} 
						onClick={() => history.push("/borrow")} />
				</div>
				<div style={{ justifySelf: "start" }}>
					<SubHeaderButton 
						text="Portfolio" 
						border={history.location.pathname === "/portfolio"} 
						onClick={() => history.push("/portfolio")} />
				</div>
			</div>
		</Toolbar>
	);
};

const Header = () => {
	return (
		<>
			<TopHeader />
			<SubHeader />
		</>
	)
}

export default Header;


// import React from 'react';
// import 'regenerator-runtime/runtime';
// import './global.css';
// import { login, logout } from './utils';

// const App = () => {
// 	//@ts-ignore
// 	const { walletConnection, accountId } = window;

// 	return (
// 		<>
// 			{walletConnection.isSignedIn() ? (
// 				<button
// 					className="link"
// 					style={{ float: 'right' }}
// 					onClick={logout}>
// 					Sign out
// 				</button>
// 			) : (
// 				<main>
// 					<button onClick={login}>Sign in</button>
// 				</main>
// 			)}
// 			<main>
// 				<h1>
// 					{accountId}
// 				</h1>
// 			</main>
// 		</>
// 	);
// };

// export default App;
