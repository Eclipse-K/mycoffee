import Logo from "../images/Logo_MyCoffee.png";
import StyledLogo from "./StyledLogo";

function NaviBar() {
  return (
    <div>
      <div>
        <StyledLogo src={Logo} alt="Logo" />
      </div>
      <div>
        <ul>
          <li>로그인</li>
          <li>회원가입</li>
        </ul>
      </div>
      <div>
        <ul>
          <li>홀빈</li>
          <li>드립백</li>
          <li>핸드드립</li>
          <li>그라인더</li>
        </ul>
      </div>
    </div>
  );
}

export default NaviBar;
