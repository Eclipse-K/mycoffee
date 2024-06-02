import Logo from "../images/Logo_MyCoffee.png";
import StyledLogo from "./StyledLogo";
import "./NaviBar.css";

function NaviBar() {
  return (
    <div className="nav-area">
      <div className="nav-top">
        <div className="nav-logo-img">
          <StyledLogo src={Logo} alt="Logo" />
        </div>
        <ul className="nav-login">
          <li>로그인</li>
          <li>회원가입</li>
        </ul>
      </div>

      <div className="nav-middle">
        <h1 className="nav-logo">My Coffee</h1>

        <div className="nav-item">
          <ul className="nav-list">
            <li>홀빈</li>
            <li>드립백</li>
            <li>핸드드립</li>
            <li>제품</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NaviBar;
