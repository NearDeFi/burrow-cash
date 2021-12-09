import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";

import App from "./App";
import { Modal } from "./components";
import { ContractContextProvider } from "./context/contracts";
import "./global.css";
import { initContract } from "./utils";
import { IBurrow } from "./interfaces/burrow";
import theme from "./theme";
import { store } from "./redux/store";

export const Burrow = React.createContext<IBurrow>({} as IBurrow);

// @ts-ignore
window.nearInitPromise = initContract()
  .then((initResults) => {
    ReactDOM.render(
      <Provider store={store}>
        <Burrow.Provider value={initResults}>
          <ThemeProvider theme={theme}>
            <ContractContextProvider>
              <App />
            </ContractContextProvider>
            <Modal />
          </ThemeProvider>
        </Burrow.Provider>
      </Provider>,
      document.querySelector("#root"),
    );
  })
  .catch(console.error);
