import { useState, useEffect } from "react";
import "./QuantityDropdown.css";

function QuantityDropdown({ initialQuantity, onQuantityChange }) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [showDrop, setShowDrop] = useState(false);
  const quantities = Array.from({ length: 10 }, (_, i) => i + 1);

  // 장바구니의 count가 업데이트될 때 dropdown의 수량도 업데이트
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const toggleDropdown = () => {
    setShowDrop(!showDrop);
  };

  const handleSelectQuantity = (value) => {
    setQuantity(value);
    setShowDrop(false);
    onQuantityChange(value); // 부모 컴포넌트에 선택된 수량을 알림
  };

  return (
    <div className="Quantity">
      <div className="Quantity-display" onClick={toggleDropdown}>
        {quantity}
        <button className="Quantity-button">▼</button>
      </div>
      {showDrop && (
        <ul className="Quantity-num-list">
          {quantities.map((num) => (
            <li
              key={num}
              className="Quantity-number"
              onClick={() => handleSelectQuantity(num)}
            >
              {num}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuantityDropdown;
