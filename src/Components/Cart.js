import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import Logo from "../images/Logo_MyCoffee.png";
import "./Cart.css";
import { Link } from "react-router-dom";
import { MdCancelPresentation } from "react-icons/md";

function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [isAllChecked, setIsAllChecked] = useState(true);
  const [checkedItemIndexes, setCheckedItemIndexes] = useState(
    cartItems.map((_, index) => index)
  );

  // 전체 선택 체크박스 클릭 핸들러
  const handleAllCheckboxClick = () => {
    if (isAllChecked) {
      // 전체 선택 해제 시, 개별 체크박스도 모두 해제
      setCheckedItemIndexes([]);
    } else {
      // 전체 선택 시, 모든 항목 선택
      setCheckedItemIndexes(cartItems.map((_, index) => index));
    }
    setIsAllChecked(!isAllChecked);
  };

  const handleItemCheckboxClick = (index) => {
    const newCheckedItemIndexes = checkedItemIndexes.includes(index)
      ? checkedItemIndexes.filter((i) => i !== index)
      : [...checkedItemIndexes, index];
    setCheckedItemIndexes(newCheckedItemIndexes);
    setIsAllChecked(newCheckedItemIndexes.length === cartItems.length);
  };

  return (
    <div className="Cart">
      <div className="Cart-nav">
        <Link to="/">
          <img className="Cart-Logo" src={Logo} alt="Cart-Logo" />
        </Link>
        <div className="Cart-Logo-title">My Coffee</div>
      </div>
      <h1 className="Cart-title">장바구니</h1>
      <form className="Cart-form">
        <input
          className="Cart-all-input"
          type="checkbox"
          id="AllCheck"
          name="전체선택"
          checked={
            isAllChecked && checkedItemIndexes.length === cartItems.length
          }
          onChange={handleAllCheckboxClick}
        />
        <label htmlFor="AllCheck">전체 선택</label>
      </form>
      {cartItems.length === 0 ? (
        <p className="Cart-empty">장바구니가 비었습니다.</p>
      ) : (
        <div className="Cart-container">
          {cartItems.map((item, index) => (
            <div className="Cart-area" key={index}>
              <input
                className="Cart-area-input"
                type="checkbox"
                id={index}
                name={index}
                checked={checkedItemIndexes.includes(index)}
                onChange={() => handleItemCheckboxClick(index)}
              />
              <img className="Cart-img" src={item.img} alt={item.title} />
              <div className="Cart-area-second">
                <p className="Cart-area-title">{item.title}</p>
                <p className="Cart-area-price">{item.price}</p>
              </div>
              <div className="Cart-remove">
                <MdCancelPresentation onClick={() => removeFromCart(index)} />
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ "padding-left": "16px" }}>
        <button style={{ "margin-right": "8px" }}>전체구매</button>
        <button>선택구매</button>
      </div>
    </div>
  );
}

export default Cart;
