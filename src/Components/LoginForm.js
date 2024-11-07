import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import { useState } from "react";
import axios from "axios"; // axios도 추가
import "./LoginForm.css";
import Logo from "../images/Logo_MyCoffee.png";

function Login() {
  const [LoginId, setLoginId] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // useNavigate로 navigate 정의

  const handleIdChange = (e) => {
    setLoginId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setLoginPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!LoginId) {
      setErrorMessage("아이디를 적어주세요.");
    } else if (!LoginPassword) {
      setErrorMessage("비밀번호를 입력해주세요.");
    } else {
      setErrorMessage("");

      try {
        const response = await axios.post("http://localhost:5001/api/login", {
          username: LoginId,
          password: LoginPassword,
        });

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          alert("로그인 성공!");
          navigate("/myPage"); // 로그인 성공 시 myPage로 이동
        } else {
          setErrorMessage("로그인 실패: " + response.data.message);
        }
      } catch (error) {
        console.error("로그인 중 오류:", error);
        setErrorMessage("서버 오류가 발생했습니다.");
      }
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
          type="text"
          placeholder="아이디"
          value={LoginId}
          onChange={handleIdChange}
        />
        <input
          className="LoginForm-input"
          type="password"
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
          <Link className="LoginForm-sign" to="/PrivacyPolicy">
            회원가입
          </Link>
          <Link className="LoginForm-search-pw" to="/Find_pw">
            비밀번호 찾기
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
