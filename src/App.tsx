import "regenerator-runtime/runtime";
import { Navigate } from "react-router";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Borrow, Portfolio, Supply, Terms, Privacy } from "./screens";
import { Layout } from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate replace to="/supply" />} />
          <Route path="/supply" element={<Supply />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
