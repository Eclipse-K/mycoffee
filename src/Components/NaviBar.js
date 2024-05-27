import Logo from "../images/Logo_MyCoffee.png";
import StyledLogo from "./StyledLogo";
import "./NaviBar.css";

function NaviBar() {
  return (
    <div className="nav-area">
      <ul className="nav-login">
        <li>로그인</li>
        <li>회원가입</li>
      </ul>

      <div className="nav">
        <div className="nav-logo">
          <StyledLogo src={Logo} alt="Logo" />
          <p>My Coffee</p>
        </div>
        <div className="nav-item">
          <ul className="nav-list">
            <li>홀빈</li>
            <li>드립백</li>
            <li>핸드드립</li>
            <li>그라인더</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NaviBar;
