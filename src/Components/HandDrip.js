import NaviBar from "./NaviBar";
import "./HandDrip.css";
import { useContext, useState } from "react";
import CoffeeJson from "../Coffee.json";
import { CartContext } from "./CartContext";

function HandDrip() {
  // eslint-disable-next-line
  const [handDrip, setHandDrip] = useState(CoffeeJson.HandDrip);
  const { addToCart } = useContext(CartContext);

  return (
    <div className="HandDrip">
      <NaviBar />
      <h1 className="HandDrip-title">- HandDrip -</h1>
      <div className="HandDrip-box">
        <div className="HandDrip-container">
          {handDrip.map((hand) => (
            <div className="HandDrip-area" key={hand.id}>
              <div className="HandDrip-content">
                <img className="HandDrip-img" src={hand.img} alt={hand.title} />
                <div className="Basket-Button" onClick={() => addToCart(hand)}>
                  장바구니 담기
                </div>
                <h3>{hand.title}</h3>
                <p>가격 : {hand.price}</p>
                <p className="HandDrip-p-content">특징 : {hand.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HandDrip;
