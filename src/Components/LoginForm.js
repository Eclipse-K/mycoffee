import { Link } from "react-router-dom";
import { useState } from "react";
import "./LoginForm.css";
import Logo from "../images/Logo_MyCoffee.png";

function Login() {
  const [LoginId, setLoginId] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleIdChange = (e) => {
    setLoginId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setLoginPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!LoginId) {
      setErrorMessage("아이디를 적어주세요.");
    } else if (!LoginPassword) {
      setErrorMessage("비밀번호를 입력해주세요.");
    } else {
      setErrorMessage("");
      console.log("Email:", LoginId);
      console.log("Password:", LoginPassword);
    }
  };

  return (
    <div className="LoginForm-container">
      <Link to="/">
        <img className="LoginForm-logo" src={Logo} alt="Logo" />
      </Link>
      <h1 className="LoginForm-title-1">My Coffee</h1>
      <form onSubmit={handleSubmit} className="LoginForm-form">
        <input
          className="LoginForm-input"
          type="LoginId"
          placeholder="아이디"
          value={LoginId}
          onChange={handleIdChange}
        />
        <input
          className="LoginForm-input"
          type="LoginPassword"
          placeholder="비밀번호"
          value={LoginPassword}
          onChange={handlePasswordChange}
        />
        {errorMessage && <div className="LoginForm-error">{errorMessage}</div>}
        <button className="LoginForm-submit" type="submit">
          로그인
        </button>
        <div className="LoginForm-Search">
          <Link className="LoginForm-search-id" to="/Find_id">
            아이디 찾기
          </Link>
          <Link className="LoginForm-search-pw">비밀번호 찾기</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
