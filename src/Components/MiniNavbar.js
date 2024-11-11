import Logo from "../images/Logo_MyCoffee.png";
import StyledLogo from "./StyledLogo";
import "./NaviBar.css";
import { Link } from "react-router-dom";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from "./CartContext";

function MiniNavbar() {
  const { cartItems } = useCart();

  return (
    <div className="nav-top">
      <Link className="nav-logo-img" to="/">
        <StyledLogo src={Logo} alt="Logo" />
      </Link>

      <div className="nav-guest">
        <Link className="Shopping-cart" to="/Cart">
          {cartItems.length === 0 ? (
            <p></p>
          ) : (
            <div className="Shopping-cart-length">{cartItems.length}</div>
          )}

          <AiOutlineShoppingCart />
        </Link>
        <Link className="nav-login" to="/Login">
          <AiOutlineUser />
        </Link>
      </div>
    </div>
  );
}

export default MiniNavbar;
