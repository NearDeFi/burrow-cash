import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initContract } from "./utils";
import { Account, Contract, WalletConnection } from "near-api-js";
import "./global.css";
import { Modal } from "./components";

export interface IBurrow {
	walletConnection: WalletConnection;
	account: Account;
	logicContract: Contract;
	oracleContract: Contract;
	view: Function;
	send: Function;
}

export const Burrow = React.createContext<IBurrow | null>(null);

//@ts-ignore
window.nearInitPromise = initContract()
	.then((initResults) => {
		ReactDOM.render(
			<Modal>
				<Burrow.Provider value={initResults}>
					<App />,
				</Burrow.Provider>
			</Modal>,
			document.querySelector("#root"),
		);
	})
	.catch(console.error);
