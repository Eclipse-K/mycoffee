import { useState } from "react";

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
    <div>
      <h1>비밀번호 찾기</h1>
      <form onSubmit={handleFindPwSubmit}>
        <label>
          이메일
          <input
            type="email"
            value={emailPw}
            onChange={(e) => setEmailPw(e.target.value)}
          />
        </label>
        {findPwError && <p>{findPwError}</p>}
        <button type="submit">비밀번호 찾기</button>
      </form>
    </div>
  );
}

export default FindPwPage;
