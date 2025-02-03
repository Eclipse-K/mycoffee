import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyWishlist.css";
import { Navigate } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";

function MyWishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // 세션스토리지에서 토큰 가져오기
    if (!token) {
      alert("로그인이 필요합니다.");
      Navigate("/login"); // 로그인 페이지로 이동
      return;
    }

    axios
      .get("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setWishlist(response.data || []))
      .catch((err) => console.error("위시리스트 가져오기 오류:", err));
  }, []);

  const removeFromWishlist = (uuid) => {
    const token = sessionStorage.getItem("token"); // 세션스토리지에서 토큰 가져오기
    axios
      .post(
        "/api/wishlist/remove",
        { uuid }, // uuid를 서버로 전달
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        // 삭제 성공 시 상태 업데이트
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item.uuid !== uuid)
        );
      })
      .catch((err) => console.error("위시리스트 삭제 오류:", err));
  };

  if (wishlist.length === 0) {
    return <div className="Wishlist-Empty">위시리스트가 비어 있습니다.</div>;
  }

  return (
    <div className="MyWishlist">
      <h2 className="MyWishlist-title">나의 위시리스트</h2>
      <hr />
      <ul className="Wishlist-Item-Container">
        {wishlist.map((item) => (
          <li key={item.uuid} className="Wishlist-Item">
            <img src={item.img} alt={item.title} />
            <div className="Wishlist-Item-Content">
              <h2>{item.title}</h2>
              <p>{item.price}원</p>
            </div>

            <MdOutlineCancel
              className="Remove-Button"
              onClick={() => removeFromWishlist(item.uuid)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyWishlist;
