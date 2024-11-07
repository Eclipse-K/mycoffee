// myPage.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 토큰이 있는 경우, 서버에 토큰 유효성을 확인하여 사용자 이름을 가져옵니다.
    axios
      .post("http://localhost:5001/api/verify-token", { token })
      .then((response) => {
        if (response.data.success) {
          setUsername(response.data.username);
        } else {
          alert("토큰이 유효하지 않습니다. 다시 로그인 해주세요.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("토큰 확인 오류:", error);
        alert("로그인 정보 확인 중 오류가 발생했습니다.");
      });
  }, [navigate]);

  return (
    <div>
      <h1>My Page</h1>
      <p>안녕하세요, {username}님!</p>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        로그아웃
      </button>
    </div>
  );
}

export default MyPage;
