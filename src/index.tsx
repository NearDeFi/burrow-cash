import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Modal } from "./components";
import { AssetsContextProvider } from "./context/assets";
import "./global.css";
import { initContract } from "./utils";
import { IBurrow } from "./interfaces/burrow";

export const Burrow = React.createContext<IBurrow | null>(null);

//@ts-ignore
window.nearInitPromise = initContract()
	.then((initResults) => {
		ReactDOM.render(
			<Burrow.Provider value={initResults}>
				<Modal>
					<AssetsContextProvider>
						<App />
					</AssetsContextProvider>
				</Modal>
			</Burrow.Provider>,
			document.querySelector("#root"),
		);
	})
	.catch(console.error);
