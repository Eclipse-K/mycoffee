// myPage.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyPage.css";
import MiniNavbar from "./MiniNavbar";
import OrderInquiry from "./MyPageFolder/OrderInquiry";
import CouponList from "./CouponList";

function MyPage() {
  const [username, setUsername] = useState("");
  const [selectedTab, setSelectedTab] = useState("나의 쇼핑 정보");
  const [orderActive, setOrderActive] = useState("orderHistory");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedId = localStorage.getItem("id");
    const storedUsername = localStorage.getItem("username");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (storedId && storedUsername) {
      setUsername(storedUsername);
    } else {
      axios
        .post("http://localhost:5001/api/verify-token", { token })
        .then((response) => {
          if (response.data.success) {
            setUsername(response.data.username);
            localStorage.setItem("id", response.data.id);
            localStorage.setItem("username", response.data.username);
          } else {
            alert("토큰이 유효하지 않습니다. 다시 로그인 해주세요.");
            localStorage.removeItem("token");
            localStorage.removeItem("id");
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
    localStorage.removeItem("username");
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    if (tab === "취소/반품") {
      setOrderActive("cancelHistory"); // OrderInquiry의 '취소/반품' 탭 활성화
    } else if (tab === "주문/배송") {
      setOrderActive("orderHistory"); // OrderInquiry의 '주문/배송' 탭 활성화
    }
  };

  return (
    <div className="myPage">
      <div className="myPage-container">
        <MiniNavbar />

        <h1 className="myPage-title">{username} 님, 환영합니다.</h1>

        <div className="myPage-box">
          <div className="myPage-sidebar">
            <h2
              className="myPage-subtitle"
              onClick={() => handleTabClick("나의 쇼핑 정보")}
            >
              마이페이지
            </h2>
            <hr />
            <h3>나의 쇼핑 정보</h3>
            <ul>
              <li
                className={selectedTab === "주문/배송" ? "active" : ""}
                onClick={() => handleTabClick("주문/배송")}
              >
                주문/배송
              </li>
              <li
                className={selectedTab === "취소/반품" ? "active" : ""}
                onClick={() => handleTabClick("취소/반품")}
              >
                취소/반품
              </li>
              <li
                className={selectedTab === "쿠폰" ? "active" : ""}
                onClick={() => handleTabClick("쿠폰")}
              >
                쿠폰
              </li>
            </ul>

            <h3>나의 활동 정보</h3>
            <ul>
              <li
                className={selectedTab === "회원정보 수정" ? "active" : ""}
                onClick={() => handleTabClick("회원정보 수정")}
              >
                회원정보 수정
              </li>
              <li
                className={selectedTab === "배송 주소록 관리" ? "active" : ""}
                onClick={() => handleTabClick("배송 주소록 관리")}
              >
                배송 주소록 관리
              </li>
              <li
                className={selectedTab === "나의 게시물 관리" ? "active" : ""}
                onClick={() => handleTabClick("나의 게시물 관리")}
              >
                나의 게시물 관리
              </li>
              <li
                className={selectedTab === "나의 문의" ? "active" : ""}
                onClick={() => handleTabClick("나의 문의")}
              >
                나의 문의
              </li>
              <li
                className={selectedTab === "위시리스트" ? "active" : ""}
                onClick={() => handleTabClick("위시리스트")}
              >
                위시리스트
              </li>
              <li
                className={selectedTab === "최근 본 상품" ? "active" : ""}
                onClick={() => handleTabClick("최근 본 상품")}
              >
                최근 본 상품
              </li>
              <li
                className={selectedTab === "회원탈퇴" ? "active" : ""}
                onClick={() => handleTabClick("회원탈퇴")}
              >
                회원탈퇴
              </li>
              <button className="myPage-logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </ul>
          </div>

          <div className="myPage-content">
            {selectedTab === "쿠폰" ? (
              <CouponList />
            ) : selectedTab === "주문/배송" || selectedTab === "취소/반품" ? (
              <OrderInquiry
                orderActive={orderActive}
                setOrderActive={setOrderActive}
              />
            ) : (
              <div>
                <div className="myPage-order-status">
                  <h2>
                    주문처리 현황 <span>(최근 3개월 기준)</span>
                  </h2>
                  <hr />
                  <div className="myPage-status-summary">
                    <div className="myPage-status-item">
                      <span>입금대기</span>
                      <strong>0</strong>
                    </div>
                    <span className="myPage-status-arrow">➔</span>
                    <div className="myPage-status-item">
                      <span>상품준비중</span>
                      <strong>0</strong>
                    </div>
                    <span className="myPage-status-arrow">➔</span>
                    <div className="myPage-status-item">
                      <span>배송중</span>
                      <strong>0</strong>
                    </div>
                    <span className="myPage-status-arrow">➔</span>
                    <div className="myPage-status-item">
                      <span>배송완료</span>
                      <strong>0</strong>
                    </div>
                    <span className="myPage-status-arrow">➔</span>
                    <div className="myPage-status-item">
                      <span>취소/교환/반품</span>
                      <strong>0/0/0</strong>
                    </div>
                  </div>
                </div>
                <div className="myPage-recent-orders">
                  <h2>최근 주문내역</h2>
                  <hr />
                  <table className="myPage-order-table">
                    <thead>
                      <tr>
                        <th>주문일자 [주문번호]</th>
                        <th>상품정보</th>
                        <th>수량</th>
                        <th>주문금액</th>
                        <th>주문상태</th>
                        <th>취소/교환/반품</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="6" className="myPage-empty-orders">
                          주문 내역이 없습니다.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
