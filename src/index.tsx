import dotenv from "dotenv";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import { Modal } from "./components";
import theme from "./theme";
import { store, persistor } from "./redux/store";
import "./global.css";

dotenv.config();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <App />
        <Modal />
      </ThemeProvider>
    </PersistGate>
  </Provider>,
  document.querySelector("#root"),
);
