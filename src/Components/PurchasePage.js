import { useContext, useState } from "react";
import "./PurchasePage.css";
import { CartContext } from "./CartContext";

function PurchasePage({ checkedItemIndexes, onGoBack, quantities }) {
  const { cartItems } = useContext(CartContext);
  const selectedItems = checkedItemIndexes.map((index) => cartItems[index]);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [activeTab, setActiveTab] = useState("신용카드");
  const [cardInfo, setCardInfo] = useState({
    cardType: "",
    installment: "",
  });

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleCardInfoChange = (e) => {
    const { name, value } = e.target;
    setCardInfo({ ...cardInfo, [name]: value });
  };

  const handlePurchase = () => {
    if (
      !shippingInfo.name ||
      !shippingInfo.address ||
      !/^\d{3}-\d{3,4}-\d{4}$/.test(shippingInfo.phone)
    ) {
      alert("모든 배송지 정보를 올바르게 입력해주세요.");
      return;
    }

    console.log("구매 완료:", selectedItems, shippingInfo, cardInfo);
    alert("구매가 완료되었습니다!");
  };

  // 총 가격 계산
  const totalPrice = selectedItems.reduce((total, item, index) => {
    const quantity = quantities[checkedItemIndexes[index]];
    const itemPrice = Number(item.price.replace(/,/g, ""));
    return total + (itemPrice || 0) * (quantity || 0);
  }, 0);

  return (
    <div className="Purchase">
      <div className="Purchase-container">
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
                <td>{item.price.toLocaleString()}원</td>
                <td>{quantities[checkedItemIndexes[index]]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="Total-price">
          <h3>총 가격: {totalPrice.toLocaleString()}원</h3>
        </div>

        <hr />

        <h2>배송지 정보</h2>
        <form className="Shipping-form">
          <div>
            <label htmlFor="shippingName">이 름:</label>
            <input
              id="shippingName"
              type="text"
              name="name"
              value={shippingInfo.name}
              onChange={handleShippingChange}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="shippingAddress">주 소:</label>
            <input
              id="shippingAddress"
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingChange}
              autoComplete="street-address"
            />
          </div>
          <div>
            <label htmlFor="shippingPhone">연락처:</label>
            <input
              id="shippingPhone"
              type="text"
              name="phone"
              placeholder="010-1234-5678"
              value={shippingInfo.phone}
              onChange={handleShippingChange}
              autoComplete="tel"
            />
          </div>
        </form>

        <hr />

        <h2>결제 정보</h2>
        <div className="tabs">
          <button
            className={activeTab === "신용카드" ? "active" : ""}
            onClick={() => handleTabClick("신용카드")}
          >
            신용카드
          </button>
          <button
            className={activeTab === "네이버페이" ? "active" : ""}
            onClick={() => handleTabClick("네이버페이")}
          >
            네이버페이
          </button>
          <button
            className={activeTab === "카카오페이" ? "active" : ""}
            onClick={() => handleTabClick("카카오페이")}
          >
            카카오페이
          </button>
          <button
            className={activeTab === "실시간계좌이체" ? "active" : ""}
            onClick={() => handleTabClick("실시간계좌이체")}
          >
            실시간계좌이체
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "신용카드" && (
            <div className="tab-area">
              <div>
                <label htmlFor="cardType">카드 선택:</label>
                <select
                  id="cardType"
                  name="cardType"
                  value={cardInfo.cardType}
                  onChange={handleCardInfoChange}
                >
                  <option value="">카드를 선택하세요</option>
                  <option value="KukminCard">국민카드</option>
                  <option value="SinhanCard">신한카드</option>
                  <option value="SamsungCard">삼성카드</option>
                  <option value="LotteCard">롯데카드</option>
                  <option value="NHCard">NH카드</option>
                  <option value="HanaCard">하나카드</option>
                  <option value="CacaobankCard">카카오뱅크카드</option>
                  <option value="TossbankCard">토스뱅크카드</option>
                </select>
              </div>
              <div>
                <label htmlFor="installment">할부 기간:</label>
                <select
                  id="installment"
                  name="installment"
                  value={cardInfo.installment}
                  onChange={handleCardInfoChange}
                >
                  <option value="">일시불</option>
                  <option value="3개월">3개월</option>
                  <option value="6개월">6개월</option>
                  <option value="12개월">12개월</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "네이버페이" && (
            <p>네이버페이로 결제할 수 있습니다.</p>
          )}
          {activeTab === "카카오페이" && (
            <p>카카오페이로 결제할 수 있습니다.</p>
          )}
          {activeTab === "실시간계좌이체" && (
            <p>실시간 계좌이체로 결제할 수 있습니다.</p>
          )}
        </div>

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
    </div>
  );
}

export default PurchasePage;
