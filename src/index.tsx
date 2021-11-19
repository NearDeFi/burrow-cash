import React from "react";
import ReactDOM from "react-dom";
import { Box } from "@mui/material";
// import { ThemeProvider } from "@mui/material/styles";

// import App from "./App";
// import { Modal } from "./components";
// import { ContractContextProvider } from "./context/contracts";
// import { initContract } from "./utils";
// import theme from "./theme";
import { IBurrow } from "./interfaces/burrow";
import "./global.css";

export const Burrow = React.createContext<IBurrow>({} as IBurrow);

const ComingSoon = () => (
  <Box display="flex" alignItems="center" height="100vh" justifyContent="center">
    <Box>coming soon...</Box>
  </Box>
);

ReactDOM.render(<ComingSoon />, document.querySelector("#root"));

// @ts-ignore
// window.nearInitPromise = initContract()
//   .then((initResults) => {
//     ReactDOM.render(
//       <Burrow.Provider value={initResults}>
//         <ThemeProvider theme={theme}>
//           <Modal>
//             <ContractContextProvider>
//               <App />
//             </ContractContextProvider>
//           </Modal>
//         </ThemeProvider>
//       </Burrow.Provider>,
//       document.querySelector("#root"),
//     );
//   })
//   .catch(console.error);
