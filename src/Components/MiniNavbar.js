import Logo from "../images/Logo_MyCoffee.png";
import StyledLogo from "./StyledLogo";
import "./MiniNavbar.css";
import { Link } from "react-router-dom";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from "./CartContext";
import { useLogged } from "./LoggedContext";

function MiniNavbar() {
  const { cartItems } = useCart();
  const { isLoggedIn } = useLogged();

  return (
    <div className="miniNav-top">
      <Link className="nav-logo-img" to="/">
        <StyledLogo src={Logo} alt="Logo" />
      </Link>

      <div className="miniNav-guest">
        <Link className="Shopping-cart" to="/Cart">
          {cartItems.length === 0 ? (
            <p></p>
          ) : (
            <div className="Shopping-cart-length">{cartItems.length}</div>
          )}

          <AiOutlineShoppingCart />
        </Link>

        {isLoggedIn ? (
          <Link className="nav-login" to="/myPage">
            <AiOutlineUser />
          </Link>
        ) : (
          <Link className="nav-login" to="/Login">
            <AiOutlineUser />
          </Link>
        )}
      </div>
    </div>
  );
}

export default MiniNavbar;
