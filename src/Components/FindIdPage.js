import { useState } from "react";
import "./FindIdPage.css";
import { Link } from "react-router-dom";
import StyledLogo from "./StyledLogo";
import Logo from "../images/Logo_MyCoffee.png";
import "./FindNav.css";

function FindIdPage() {
  const [findName, setFindName] = useState("");
  const [findEmail, setFindEmail] = useState("");
  const [findPhone, setFindPhone] = useState("");
  const [findMessage, setFindMessage] = useState("");
  const [memberType, setMemberType] = useState("개인회원");
  const [contactOption, setContactOption] = useState("email");

  const handleFindNameChange = (e) => {
    setFindName(e.target.value);
  };

  const handleFindEmailChange = (e) => {
    setFindEmail(e.target.value);
  };

  const handleFindPhoneChange = (e) => {
    setFindPhone(e.target.value);
  };

  const handleMemberTypeChange = (e) => {
    setMemberType(e.target.value);
  };

  const handleContactOptionChange = (e) => {
    setContactOption(e.target.value);
  };

  const handleFindSubmit = (e) => {
    e.preventDefault();
    // 아이디 찾기 로직 (API 호출 등)
    if (
      contactOption === "email" &&
      findEmail === "test@example.com" &&
      findName === "John Doe"
    ) {
      setFindMessage("아이디는 user123입니다.");
    } else if (
      contactOption === "phone" &&
      findPhone === "010-1234-5678" &&
      findName === "John Doe"
    ) {
      setFindMessage("아이디는 user123입니다.");
    } else {
      setFindMessage("입력 정보를 확인해주세요.");
    }
  };

  return (
    <div className="find-id">
      <nav className="Find-nav">
        <Link className="Find-nav-logo-img" to="/">
          <StyledLogo src={Logo} alt="Logo" />
          <h4>아이디 찾기</h4>
        </Link>

        <Link className="Find-nav-home" to="/">
          <h4>MyCoffee Home</h4>
        </Link>
      </nav>
      <div className="Find-id-container">
        <div className="find-id-page">
          <h2>아이디 찾기</h2>
          <form onSubmit={handleFindSubmit}>
            <label htmlFor="memberType">회원유형</label>
            <select
              id="memberType"
              value={memberType}
              onChange={handleMemberTypeChange}
            >
              <option value="개인회원">개인회원</option>
              <option value="기업회원">기업회원</option>
              <option value="외국인회원">외국인회원</option>
            </select>

            <div className="contact-option">
              <input
                type="radio"
                id="contact-email"
                value="email"
                checked={contactOption === "email"}
                onChange={handleContactOptionChange}
              />
              <label htmlFor="contact-email">이메일</label>

              <input
                type="radio"
                id="contact-phone"
                value="phone"
                checked={contactOption === "phone"}
                onChange={handleContactOptionChange}
              />
              <label htmlFor="contact-phone">전화번호</label>
            </div>

            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              value={findName}
              onChange={handleFindNameChange}
              required
            />

            {contactOption === "email" && (
              <>
                <label htmlFor="email">이메일</label>
                <input
                  type="email"
                  id="email"
                  value={findEmail}
                  onChange={handleFindEmailChange}
                  required
                />
              </>
            )}

            {contactOption === "phone" && (
              <>
                <label htmlFor="phone">전화번호:</label>
                <input
                  type="tel"
                  id="phone"
                  value={findPhone}
                  onChange={handleFindPhoneChange}
                  required
                />
              </>
            )}

            <button type="submit">아이디 찾기</button>
          </form>
          {findMessage && <p>{findMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default FindIdPage;
