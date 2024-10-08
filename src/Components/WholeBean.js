import React, { useContext, useState } from "react";
import NaviBar from "./NaviBar";
import "./WholeBean.css";
import CoffeeJson from "../Coffee.json";
import { CartContext } from "./CartContext";

function WholeBean() {
  // eslint-disable-next-line
  const [wholeBean, setWholeBean] = useState(CoffeeJson.WholeBean);
  const { addToCart } = useContext(CartContext);

  // 가격에 따라 오름차순으로 정렬하는 함수
  // const sortByPrice = () => {
  //   const sortedBeans = [...wholeBean].sort((a, b) => a.price - b.price);
  //   setWholeBean(sortedBeans);
  // };

  return (
    <div className="WholeBean">
      <NaviBar />
      <h1 className="WholeBean-title">- WholeBean -</h1>
      {/* <button onClick={sortByPrice}>오름차순</button> */}

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
                <div className="Basket-Button" onClick={() => addToCart(whole)}>
                  장바구니 담기
                </div>
                <h3>{whole.title}</h3>
                <p>가격 : {whole.price}</p>
                <p>아로마노트 : {whole.flavor_note}</p>
                <p>특징 : {whole.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WholeBean;
