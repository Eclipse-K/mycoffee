import NaviBar from "./NaviBar";
import "./DripBag.css";
import { useContext, useState } from "react";
import CoffeeJson from "../Coffee.json";
import { CartContext } from "./CartContext";

function DripBag() {
  // eslint-disable-next-line
  const [dripBag, setDripBag] = useState(CoffeeJson.DripBag);
  const { addToCart } = useContext(CartContext);

  return (
    <div className="DripBag">
      <NaviBar />
      <h1 className="DripBag-title">- DripBag -</h1>
      <div className="DripBag-container">
        {dripBag.map((drip) => (
          <div className="DripBag-area" key={drip.id}>
            <img className="DripBag-img" src={drip.img} alt={drip.title} />
            <div className="DripBag-content">
              <h3>{drip.title}</h3>
              <p>가격 : {drip.price}</p>
              <div className="Basket-Button" onClick={() => addToCart(drip)}>
                장바구니 담기
              </div>
              <p>특징 : {drip.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DripBag;
