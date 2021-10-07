import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initContract } from "./utils";
import { Account, Contract, WalletConnection } from "near-api-js";
import "./global.css";
import { Modal } from "./components";

export const Near = React.createContext<{
	walletConnection: WalletConnection | null;
	account: Account | null;
	contract: Contract | null;
	view: Function | null;
	send: Function | null;
}>({
	walletConnection: null,
	account: null,
	contract: null,
	view: null,
	send: null,
});

//@ts-ignore
window.nearInitPromise = initContract()
	.then((initResults) => {
		ReactDOM.render(
			<Modal>
				<Near.Provider value={initResults}>
					<App />,
				</Near.Provider>
			</Modal>,
			document.querySelector("#root"),
		);
	})
	.catch(console.error);
