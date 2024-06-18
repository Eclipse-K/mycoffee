import Home from "./Components/Home";
import Footer from "./Components/Footer";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import WholeBean from "./Components/WholeBean";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/WholeBean" element={<WholeBean />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
