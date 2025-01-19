import { useEffect, useState } from "react";
import axios from "axios";
import "./CouponList.css";

function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!username || !token) {
      console.error("Username or token is missing in sessionStorage.");
      return;
    }

    axios
      .get("http://localhost:5001/api/user-coupons", {
        params: { username },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCoupons(response.data.coupons || []))
      .catch((error) => console.error("쿠폰 데이터 불러오기 실패:", error));
  }, [username, token]);

  const fetchAvailableCoupons = () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const expiryDate = endOfMonth.toISOString().split("T")[0];

    setAvailableCoupons([
      { id: 1, name: "10% 할인 쿠폰", expiry: expiryDate },
      { id: 2, name: "무료 배송 쿠폰", expiry: expiryDate },
    ]);
    setShowPopup(true);
  };

  const claimCoupon = (couponId) => {
    if (!token) {
      console.error("Token is missing in sessionStorage.");
      return;
    }

    axios
      .post(
        "http://localhost:5001/api/claim-coupon",
        { couponId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setCoupons(response.data.coupons);
        setShowPopup(false);
        setErrorMessage(""); // 오류 메시지 초기화
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || "쿠폰 받기 실패");
      });
  };

  return (
    <div className="coupon-list">
      <h2>내 쿠폰 목록</h2>
      {coupons.length > 0 ? (
        <ul>
          {coupons.map((coupon) => (
            <li key={coupon.id}>
              <strong>{coupon.name}</strong> - 만료일: {coupon.expiry}
            </li>
          ))}
        </ul>
      ) : (
        <p>사용 가능한 쿠폰이 없습니다.</p>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button className="gettingCoupons" onClick={fetchAvailableCoupons}>
        쿠폰 받기
      </button>
      {showPopup && (
        <div className="popup">
          <h3>사용 가능한 쿠폰</h3>
          <ul>
            {availableCoupons.map((coupon) => (
              <li key={`available-${coupon.id}`}>
                <strong>{coupon.name}</strong> - 만료일: {coupon.expiry}
                <button onClick={() => claimCoupon(coupon.id)}>받기</button>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowPopup(false)}>닫기</button>
        </div>
      )}
    </div>
  );
}

export default CouponList;
