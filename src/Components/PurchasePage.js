import React from "react";
import "./PurchasePage.css"; // 스타일링을 위한 CSS 파일
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";

function PurchasePage({ checkedItemIndexes, onGoBack, quantities }) {
  const { cartItems } = useContext(CartContext);
  const selectedItems = checkedItemIndexes.map((index) => cartItems[index]);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expirationDate: "",
    cvc: "",
  });

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handlePurchase = () => {
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone) {
      alert("모든 배송지 정보를 입력해주세요.");
      return;
    }

    if (
      !paymentInfo.cardNumber ||
      !paymentInfo.expirationDate ||
      !paymentInfo.cvc
    ) {
      alert("모든 결제 정보를 입력해주세요.");
      return;
    }

    // 여기서 실제 구매 로직을 처리 (API 요청 등)
    console.log("구매 완료:", selectedItems, shippingInfo, paymentInfo);
    alert("구매가 완료되었습니다!");
  };

  return (
    <div className="Purchase">
      <h1>구매 페이지</h1>

      <h2>구매 목록</h2>
      <table className="Purchase-table">
        <thead>
          <tr>
            <th>상품명</th>
            <th>가격</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.price}</td>
              <td>{quantities[checkedItemIndexes[index]]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h2>배송지 정보</h2>
      <form className="shipping-form">
        <div>
          <label>이름:</label>
          <input
            type="text"
            name="name"
            value={shippingInfo.name}
            onChange={handleShippingChange}
          />
        </div>
        <div>
          <label>주소:</label>
          <input
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={handleShippingChange}
          />
        </div>
        <div>
          <label>연락처:</label>
          <input
            type="text"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleShippingChange}
          />
        </div>
      </form>

      <hr />

      <h2>결제 정보</h2>
      <form className="payment-form">
        <div>
          <label>카드 번호:</label>
          <input
            type="text"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handlePaymentChange}
          />
        </div>
        <div>
          <label>유효 기간:</label>
          <input
            type="text"
            name="expirationDate"
            placeholder="MM/YY"
            value={paymentInfo.expirationDate}
            onChange={handlePaymentChange}
          />
        </div>
        <div>
          <label>CVC:</label>
          <input
            type="text"
            name="cvc"
            value={paymentInfo.cvc}
            onChange={handlePaymentChange}
          />
        </div>
      </form>

      <hr />

      <div className="Purchase-actions">
        <button className="back-button" onClick={onGoBack}>
          뒤로가기
        </button>
        <button className="Purchase-button" onClick={handlePurchase}>
          구매하기
        </button>
      </div>
    </div>
  );
}

export default PurchasePage;
