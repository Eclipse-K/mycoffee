import { useEffect, useState } from "react";
import axios from "axios";
import "./CouponList.css";

function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const username = sessionStorage.getItem("username"); // 세션스토리지에서 유저 이름 가져오기

  useEffect(() => {
    if (!username) {
      console.error("Username is not found in sessionStorage.");
      return;
    }

    axios
      .get("http://localhost:5001/api/user-coupons", {
        params: { username },
      })
      .then((response) => {
        setCoupons(response.data.coupons || []);
      })
      .catch((error) => {
        console.error("쿠폰 데이터 불러오기 실패:", error);
      });
  }, [username]);

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
    </div>
  );
}

export default CouponList;
