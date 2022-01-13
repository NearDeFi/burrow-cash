import dotenv from "dotenv";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";

import App from "./App";
import { Modal } from "./components";
import theme from "./theme";
import { store } from "./redux/store";
import "./global.css";

dotenv.config();

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
      <Modal />
    </ThemeProvider>
  </Provider>,
  document.querySelector("#root"),
);
