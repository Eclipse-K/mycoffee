import Home from "./Components/Home";
import Footer from "./Components/Footer";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import CategoryPage from "./Components/CategoryPage";
import SignupForm from "./Components/SignupForm";
import LoginForm from "./Components/LoginForm";
import FindIdPage from "./Components/FindIdPage";
import FindPwPage from "./Components/FindPwPage";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import Cart from "./Components/Cart";
import { CartProvider } from "./Components/CartContext";
import CategoryDetail from "./Components/CategoryDetail";

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:category" element={<CategoryPage />} />
          <Route path="/:category/:id" element={<CategoryDetail />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/SignupForm" element={<SignupForm />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/Find_id" element={<FindIdPage />} />
          <Route path="/Find_pw" element={<FindPwPage />} />
          <Route path="/Cart" element={<Cart />} />
        </Routes>

        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
