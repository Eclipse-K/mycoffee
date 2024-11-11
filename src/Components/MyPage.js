// myPage.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyPage.css";
import MiniNavbar from "./MiniNavbar";

function MyPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState("나의 쇼핑 정보");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedId = localStorage.getItem("id");
    const storedEmail = localStorage.getItem("email");
    const storedUsername = localStorage.getItem("username");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (storedId && storedEmail && storedUsername) {
      setUsername(storedUsername);
      setEmail(storedEmail);
    } else {
      axios
        .post("http://localhost:5001/api/verify-token", { token })
        .then((response) => {
          if (response.data.success) {
            setUsername(response.data.username);
            setEmail(response.data.email);
            localStorage.setItem("id", response.data.id);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("username", response.data.username);
          } else {
            alert("토큰이 유효하지 않습니다. 다시 로그인 해주세요.");
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            localStorage.removeItem("email");
            localStorage.removeItem("username");
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("데이터 불러오기 오류:", error);
          alert("정보 불러오는 중 오류가 발생했습니다.");
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "주문/배송":
        return <div>주문 및 배송 정보</div>;
      case "취소/반품":
        return <div>취소 및 반품 정보</div>;
      // 나머지 케이스는 그대로 유지
      default:
        return <div>정보를 선택해주세요</div>;
    }
  };

  return (
    <div className="myPage">
      <div className="myPage-container">
        <MiniNavbar />

        <div className="myPage-box">
          <div className="myPage-sidebar">
            <h2>마이페이지</h2>
            <hr />
            <h3>나의 쇼핑 정보</h3>
            <ul>
              <li onClick={() => setSelectedTab("주문/배송")}>주문/배송</li>
              <li onClick={() => setSelectedTab("취소/반품")}>취소/반품</li>
            </ul>

            <h3>나의 혜택 정보</h3>
            <ul>
              <li onClick={() => setSelectedTab("적립금")}>적립금</li>
              <li onClick={() => setSelectedTab("쿠폰")}>쿠폰</li>
              <li onClick={() => setSelectedTab("혜택보기")}>혜택보기</li>
            </ul>

            <h3>나의 활동 정보</h3>
            <ul>
              <li onClick={() => setSelectedTab("회원정보 수정")}>
                회원정보 수정
              </li>
              <li onClick={() => setSelectedTab("배송 주소록 관리")}>
                배송 주소록 관리
              </li>
              <li onClick={() => setSelectedTab("나의 게시물 관리")}>
                나의 게시물 관리
              </li>
              <li onClick={() => setSelectedTab("나의 문의")}>나의 문의</li>
              <li onClick={() => setSelectedTab("위시리스트")}>위시리스트</li>
              <li onClick={() => setSelectedTab("최근 본 상품")}>
                최근 본 상품
              </li>
              <li onClick={() => setSelectedTab("회원탈퇴")}>회원탈퇴</li>
            </ul>
          </div>

          <div className="myPage-content">
            <h2>주문처리 현황</h2>
            <hr />
            <p>안녕하세요, {username}님!</p>
            <p>이메일: {email}</p>
            {renderContent()}
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
