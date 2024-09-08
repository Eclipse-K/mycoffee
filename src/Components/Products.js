import { useContext, useState } from "react";
import NaviBar from "./NaviBar";
import "./Products.css";
import CoffeeJson from "../Coffee.json";
import { CartContext } from "./CartContext";

function Products() {
  // eslint-disable-next-line
  const [products, SetProducts] = useState(CoffeeJson.Products);
  const { addToCart } = useContext(CartContext);
  return (
    <div className="Products">
      <NaviBar />
      <h1 className="Products-title">- Products -</h1>
      <div className="Products-container">
        {products.map((pro) => (
          <div className="Products-area" key={pro.id}>
            <img className="Products-img" src={pro.img} alt={pro.title} />
            <div className="Products-content">
              <p>{pro.title}</p>
              <p>가격 : {pro.price}</p>
              <div className="Basket-Button" onClick={() => addToCart(pro)}>
                장바구니 담기
              </div>
              <p>특징 : {pro.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
