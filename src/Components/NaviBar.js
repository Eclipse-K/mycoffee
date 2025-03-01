import Logo from "../images/Logo_MyCoffee.png";
import StyledLogo from "./StyledLogo";
import "./NaviBar.css";
import { Link } from "react-router-dom";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from "./CartContext";
import { useLogged } from "./LoggedContext";

function NaviBar() {
  const { cartItems } = useCart();
  const { isLoggedIn } = useLogged();

  return (
    <div className="NaviBar">
      <div className="nav-area">
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

        <div className="nav-middle">
          <Link className="nav-logo" to="/">
            <h1>My Coffee</h1>
          </Link>

          <div className="nav-item">
            <ul className="nav-list">
              <Link className="nav-link" to="/WholeBean">
                <li>홀빈</li>
              </Link>
              <Link className="nav-link" to="/DripBag">
                <li>드립백</li>
              </Link>
              <Link className="nav-link" to="/HandDrip">
                <li>핸드드립</li>
              </Link>
              <Link className="nav-link" to="/Products">
                <li>제품</li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NaviBar;
