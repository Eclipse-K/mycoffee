import Logo from "../images/Logo_MyCoffee.png";
import StyledLogo from "./StyledLogo";
import "./NaviBar.css";
import { Link } from "react-router-dom";

function NaviBar() {
  return (
    <div className="nav-area">
      <div className="nav-top">
        <Link className="nav-logo-img" to="/">
          <StyledLogo src={Logo} alt="Logo" />
        </Link>

        <ul className="nav-login">
          <li>로그인</li>
          <li>회원가입</li>
        </ul>
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
            <Link className="nav-link">
              <li>드립백</li>
            </Link>
            <Link className="nav-link">
              <li>핸드드립</li>
            </Link>
            <Link className="nav-link">
              <li>제품</li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NaviBar;
