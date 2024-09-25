import { useState } from "react";
import "./QuantityDropdown.css";

function QuantityDropdown() {
  const [quantity, setQuantity] = useState(1);
  const [showDrop, setShowDrop] = useState(false);
  const quantities = Array.from({ length: 10 }, (_, i) => i + 1);

  const toggleDropdown = () => {
    setShowDrop(!showDrop);
  };

  const handleSelectQuantity = (value) => {
    setQuantity(value);
    setShowDrop(false);
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
