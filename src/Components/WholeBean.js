import React, { useContext, useState } from "react";
import NaviBar from "./NaviBar";
import "./WholeBean.css";
import CoffeeJson from "../Coffee.json";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

function WholeBean() {
  // eslint-disable-next-line
  const [wholeBean, setWholeBean] = useState(CoffeeJson.WholeBean);
  const { addToCart } = useContext(CartContext);
  const [wholeLoading, setWholeLoading] = useState(false);
  const navigate = useNavigate();

  const handleViewDetail = (id) => {
    setWholeLoading(true); // 로딩 시작
    setTimeout(() => {
      setWholeLoading(false); // 로딩 끝
      navigate(`/wholebean/${id}`); // 2초 후 해당 URL로 이동
    }, 2000); // 2초 후 실행
  };

  return (
    <div className="WholeBean">
      <NaviBar />

      {wholeLoading && <LoadingSpinner />}

      <h1 className="WholeBean-title">- WholeBean -</h1>

      <div className="WholeBean-box">
        <div className="WholeBean-container">
          {wholeBean.map((whole) => (
            <div className="WholeBean-area" key={whole.id}>
              <div className="WholeBean-content">
                <img
                  className="WholeBean-img"
                  src={whole.img}
                  alt={whole.title}
                />
                <h3>{whole.title}</h3>
                <p>가격 : {whole.price}</p>
                <div className="Basket-Button" onClick={() => addToCart(whole)}>
                  장바구니 담기
                </div>
                <div
                  className="Detail-Button"
                  onClick={() => handleViewDetail(whole.id)}
                >
                  상세보기
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WholeBean;
