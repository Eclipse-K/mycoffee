// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./LoginForm.css";
import Logo from "../images/Logo_MyCoffee.png";

// const responseGoogle = (response) => {
//   console.log(response);
// };

function Login() {
  const [LoginId, setLoginId] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");

  const handleIdChange = (e) => {
    setLoginId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setLoginPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 처리 로직을 여기에 추가합니다.
    console.log("Email:", LoginId);
    console.log("Password:", LoginPassword);
  };

  return (
    // <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
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
        <button className="LoginForm-submit" type="submit">
          로그인
        </button>
        <div className="LoginForm-Search">
          <Link className="LoginForm-search-id">아이디 찾기</Link>
          <Link className="LoginForm-search-pw">비밀번호 찾기</Link>
        </div>
      </form>
      {/* <div style={{ margin: "20px 0" }}>
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div> */}
    </div>
    // </GoogleOAuthProvider>
  );
}

export default Login;
