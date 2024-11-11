import { useState } from "react";
import { Link } from "react-router-dom";
import StyledLogo from "./StyledLogo";
import Logo from "../images/Logo_MyCoffee.png";
import "./FindPwPage.css";
import "./FindNav.css";

function FindPwPage() {
  const [emailPw, setEmailPw] = useState("");
  const [findPwId, setFindPwId] = useState("");
  const [findPwError, setFindPwError] = useState("");

  const handleFindPwSubmit = (e) => {
    e.preventDefault();

    if (!findPwId) {
      setFindPwId("아이디를 입력해주세요.");
      return;
    }
    if (!emailPw) {
      setFindPwError("이메일을 입력해주세요");
      return;
    }
    // 이메일 검증 로직

    // 비밀번호 찾기 API 호출
  };

  return (
    <div className="FindPw">
      <div className="FindPw-container">
        <nav className="Find-nav">
          <Link className="Find-nav-logo-img" to="/">
            <StyledLogo src={Logo} alt="Logo" />
            <h4>비밀번호 찾기</h4>
          </Link>

          <Link className="Find-nav-home" to="/">
            <h4>MyCoffee Home</h4>
          </Link>
        </nav>
        <div className="FindPwPage">
          <div className="FindPwPage-container">
            <h2 className="FindPwPage-title">비밀번호 찾기</h2>
            <form className="FindPwPage-form" onSubmit={handleFindPwSubmit}>
              <label className="FindPwPage-label">아이디</label>
              <input
                className="FindPwPage-input"
                type="id"
                value={findPwId}
                onChange={(e) => setFindPwId(e.target.value)}
              />
              <label className="FindPwPage-label">이메일</label>
              <input
                className="FindPwPage-input"
                type="email"
                value={emailPw}
                onChange={(e) => setEmailPw(e.target.value)}
              />
              {findPwError && <p>{findPwError}</p>}
              <button className="FindPwPage-button" type="submit">
                인증하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindPwPage;
