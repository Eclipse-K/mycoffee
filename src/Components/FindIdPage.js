// src/FindIdPage.js
import { useState } from "react";
import "./FindIdPage.css";

function FindIdPage() {
  const [findName, setFindName] = useState(""); // 이름 상태 추가
  const [findEmail, setFindEmail] = useState("");
  const [findMessage, setFindMessage] = useState("");

  const handleFindNameChange = (e) => {
    setFindName(e.target.value); // 이름 상태 변경 함수 추가
  };

  const handleFindEmailChange = (e) => {
    setFindEmail(e.target.value);
  };

  const handleFindSubmit = (e) => {
    e.preventDefault();
    // 아이디 찾기 로직 (API 호출 등)
    // 여기서는 예시로 간단한 메시지를 설정
    if (findEmail === "test@example.com" && findName === "John Doe") {
      setFindMessage("아이디는 user123입니다.");
    } else {
      setFindMessage("이메일과 이름을 확인해주세요.");
    }
  };

  return (
    <div className="find-id-page">
      <h2>아이디 찾기</h2>
      <form onSubmit={handleFindSubmit}>
        <label htmlFor="name">이름:</label> {/* 이름 필드 추가 */}
        <input
          type="text"
          id="name"
          value={findName}
          onChange={handleFindNameChange}
          required
        />
        <label htmlFor="email">이메일:</label>
        <input
          type="email"
          id="email"
          value={findEmail}
          onChange={handleFindEmailChange}
          required
        />
        <button type="submit">아이디 찾기</button>
      </form>
      {findMessage && <p>{findMessage}</p>}
    </div>
  );
}

export default FindIdPage;
