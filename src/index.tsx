import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Modal } from "./components";
import { ContractContextProvider } from "./context/contracts";
import "./global.css";
import { initContract } from "./utils";
import { IBurrow } from "./interfaces/burrow";

export const Burrow = React.createContext<IBurrow | null>(null);

// @ts-ignore sdfsdf
window.nearInitPromise = initContract()
	.then((initResults) => {
		ReactDOM.render(
			<Burrow.Provider value={initResults}>
				<ContractContextProvider>
					<Modal>
						<App />
					</Modal>
				</ContractContextProvider>
			</Burrow.Provider>,
			document.querySelector("#root"),
		);
	})
	.catch(console.error);
