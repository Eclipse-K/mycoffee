import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./LoginForm.css";
import Logo from "../images/Logo_MyCoffee.png";
import LoadingSpinner from "./LoadingSpinner";
import { useLogged } from "./LoggedContext";

function Login() {
  const [LoginId, setLoginId] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { login } = useLogged();
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 정보를 가져오기 위한 훅

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
      setConfirmLoading(true);

      try {
        const response = await axios.post("http://localhost:5001/api/login", {
          id: LoginId,
          password: LoginPassword,
        });

        if (response.data.success) {
          login(response.data.token, {
            username: response.data.username,
            id: response.data.id,
            email: response.data.email,
          });

          // 🔹 로그인 후 리디렉트할 경로 설정 (이전 페이지 URL이 있으면 해당 페이지로 이동)
          const redirectPath =
            new URLSearchParams(location.search).get("redirect") || "/";
          navigate(redirectPath, { replace: true });
        } else {
          setErrorMessage("로그인 실패: " + response.data.message);
        }
      } catch (error) {
        console.error("로그인 중 오류:", error);
        setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
      } finally {
        setConfirmLoading(false);
      }
    }
  };

  return (
    <div className="LoginForm-container">
      {confirmLoading && <LoadingSpinner />}

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
          autoComplete="username"
        />
        <input type="hidden" value="dummy-username" autoComplete="username" />
        <input
          className="LoginForm-input"
          type="password"
          placeholder="비밀번호"
          value={LoginPassword}
          onChange={handlePasswordChange}
          autoComplete="current-password"
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
