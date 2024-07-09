import Home from "./Components/Home";
import Footer from "./Components/Footer";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import WholeBean from "./Components/WholeBean";
import DripBag from "./Components/DripBag";
import HandDrip from "./Components/HandDrip";
import Products from "./Components/Products";
import SignupForm from "./Components/SignupForm";
import LoginForm from "./Components/LoginForm";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/WholeBean" element={<WholeBean />} />
        <Route path="/DripBag" element={<DripBag />} />
        <Route path="/HandDrip" element={<HandDrip />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/SignupForm" element={<SignupForm />} />
        <Route path="/Login" element={<LoginForm />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
