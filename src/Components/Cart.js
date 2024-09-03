import { useContext } from "react";
import { CartContext } from "./CartContext";

function Cart() {
  const { cartItems } = useContext(CartContext);

  return (
    <div>
      <h2>장바구니</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <li key={index}>
              <img src={item.img} alt={item.title} />
              <h3>{item.title}</h3>
              <p>가격: {item.price}</p>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;
