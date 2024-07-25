import { useState } from "react";
import { Link } from "react-router-dom";
import StyledLogo from "./StyledLogo";
import Logo from "../images/Logo_MyCoffee.png";
import "./FindPwPage.css";

function FindPwPage() {
  const [emailPw, setEmailPw] = useState("");
  const [findPwError, setFindPwError] = useState("");

  const handleFindPwSubmit = (e) => {
    e.preventDefault();

    if (!emailPw) {
      setFindPwError("이메일을 입력해주세요");
      return;
    }

    // 이메일 검증 로직

    // 비밀번호 찾기 API 호출
  };

  return (
    <div className="FindPwPage">
      <nav className="Sign-nav">
        <Link className="Sign-nav-logo-img" to="/">
          <StyledLogo src={Logo} alt="Logo" />
          <h4>비밀번호 찾기</h4>
        </Link>

        <Link className="Sign-nav-home" to="/">
          <h4>MyCoffee Home</h4>
        </Link>
      </nav>
      <div className="FindPwPage-container">
        <h1 className="FindPwPage-title">비밀번호 찾기</h1>
        <form className="FindPwPage-form" onSubmit={handleFindPwSubmit}>
          <label className="FindPwPage-label">
            <p>이메일</p>
            <input
              className="FindPwPage-input"
              type="email"
              value={emailPw}
              onChange={(e) => setEmailPw(e.target.value)}
            />
          </label>
          {findPwError && <p>{findPwError}</p>}
          <button className="FindPwPage-button" type="submit">
            인증하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default FindPwPage;
