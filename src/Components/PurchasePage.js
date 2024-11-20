import { useContext, useEffect, useState } from "react";
import "./PurchasePage.css";
import { CartContext } from "./CartContext";
import axios from "axios";

function PurchasePage({ checkedItemIndexes, onGoBack, quantities }) {
  const { cartItems } = useContext(CartContext);
  const selectedItems = checkedItemIndexes.map((index) => cartItems[index]);
  const [customRequest, setCustomRequest] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    phone: "",
    request: "",
  });
  const [activeTab, setActiveTab] = useState("신용카드");
  const [cardInfo, setCardInfo] = useState({
    cardType: "",
    installment: "",
  });
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const username = localStorage.getItem("username"); // 로그인된 사용자 이름
    if (username) {
      axios
        .get(`/api/user-coupons?username=${username}`)
        .then((response) => setCoupons(response.data.coupons))
        .catch((error) => console.error("쿠폰 로드 실패:", error));
    }
  }, []);

  //요청사항 작동 함수
  const handleCustomRequest = (e) => {
    const { value } = e.target;
    setShippingInfo({ ...shippingInfo, request: value });
    if (value !== "직접 입력") {
      setCustomRequest("");
    }
  };

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
  // const totalPrice = selectedItems.reduce((total, item, index) => {
  //   const quantity = quantities[checkedItemIndexes[index]] || 1;
  //   const itemPrice = Number(item.price.replace(/,/g, ""));
  //   return total + itemPrice * quantity;
  // }, 0);

  useEffect(() => {
    const basePrice = selectedItems.reduce((total, item, index) => {
      const quantity = quantities[checkedItemIndexes[index]] || 1;
      const itemPrice = Number(item.price.replace(/,/g, ""));
      return total + itemPrice * quantity;
    }, 0);

    if (selectedCoupon) {
      const discount = selectedCoupon.discount;
      console.log("적용할 할인 값:", discount); // 디버깅 로그

      if (typeof discount === "number" && discount < 100) {
        // 퍼센트 할인
        setTotalPrice(basePrice * ((100 - discount) / 100));
      } else if (typeof discount === "number") {
        // 정액 할인
        setTotalPrice(Math.max(basePrice - discount, 0));
      } else {
        console.warn("할인 값이 유효하지 않습니다:", discount);
        setTotalPrice(basePrice); // 유효하지 않은 할인 값일 경우 원래 가격 유지
      }
    } else {
      setTotalPrice(basePrice);
    }
  }, [selectedItems, quantities, checkedItemIndexes, selectedCoupon]);

  const handleCouponChange = (couponId) => {
    const coupon = coupons.find((c) => c.id === parseInt(couponId));
    console.log("선택된 쿠폰:", coupon); // 디버깅용 로그
    setSelectedCoupon(coupon || null); // 쿠폰이 없으면 null로 초기화
  };

  // 할부 옵션을 조건부로 설정하는 함수
  const getInstallmentOptions = () => {
    const monthlyOptions = [
      { label: "일시불", value: "" },
      { label: "1개월", value: "1개월" },
      { label: "2개월", value: "2개월" },
      { label: "3개월", value: "3개월" },
      { label: "4개월", value: "4개월" },
      { label: "5개월", value: "5개월" },
      { label: "6개월", value: "6개월" },
      { label: "7개월", value: "7개월" },
      { label: "8개월", value: "8개월" },
      { label: "9개월", value: "9개월" },
      { label: "10개월", value: "10개월" },
      { label: "11개월", value: "11개월" },
      { label: "12개월", value: "12개월" },
    ];

    // 삼성카드나 현대카드일 때만 무이자 옵션 추가
    if (
      cardInfo.cardType === "SamsungCard" ||
      cardInfo.cardType === "HyundaiCard"
    ) {
      return monthlyOptions.map((option) => {
        if (["1개월", "2개월", "3개월"].includes(option.label)) {
          return { ...option, label: `${option.label} (무이자)` };
        }
        return option;
      });
    }
    return monthlyOptions;
  };

  return (
    <div className="Purchase">
      <div className="Purchase-container">
        <h1>구매 페이지</h1>

        <h2>구매 목록</h2>
        <table className="Purchase-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>수량</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.title}</td>
                <td>{quantities[checkedItemIndexes[index]] || 1}</td>
                <td>
                  {(
                    Number(item.price.replace(/,/g, "")) *
                    (quantities[checkedItemIndexes[index]] || 1)
                  ).toLocaleString()}
                  원
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="Total-price">
          <h3>총 가격: {totalPrice.toLocaleString()}원</h3>
        </div>

        <hr />

        <h2>쿠폰 선택</h2>
        <div className="Coupon-selection">
          <select
            onChange={(e) => handleCouponChange(e.target.value)}
            value={selectedCoupon?.id || ""}
          >
            <option value="">쿠폰을 선택하세요</option>
            {coupons.map((coupon) => (
              <option key={coupon.id} value={coupon.id}>
                {coupon.name} (만료: {coupon.expiry})
              </option>
            ))}
          </select>
        </div>

        <hr />

        <h2>배송지 정보</h2>
        <form className="Shipping-form">
          <div>
            <label htmlFor="shippingName">이 름</label>
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
            <label htmlFor="shippingAddress">주 소</label>
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
            <label htmlFor="shippingPhone">연락처</label>
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
          <div>
            <label htmlFor="shippingRequest">요청사항</label>
            <div className="Sipping-Request-box">
              <select
                id="shippingRequest"
                name="request"
                value={shippingInfo.request}
                onChange={handleCustomRequest}
              >
                <option value="">배송시 요청사항을 선택해주세요</option>
                <option value="문앞에 놓아주세요">
                  부재시 문앞에 놓아주세요
                </option>
                <option value="경비실에 맡겨 주세요">
                  부재시 경비실에 맡겨 주세요
                </option>
                <option value="전화 또는 문자 주세요">
                  부재시 전화 또는 문자 주세요
                </option>
                <option value="택배함에 넣어주세요">택배함에 넣어주세요</option>
                <option value="배송전에 연락주세요">배송전에 연락주세요</option>
                <option value="직접 입력">직접 입력</option>
              </select>

              {shippingInfo.request === "직접 입력" && (
                <textarea
                  type="text"
                  maxLength="50"
                  placeholder="배송 요청사항을 입력해주세요 (최대 50자)"
                  value={customRequest}
                  onChange={(e) => setCustomRequest(e.target.value)}
                />
              )}
            </div>
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
                  <option value="HyundaiCard">현대카드</option>
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
                  {getInstallmentOptions().map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "네이버페이" && (
            <ul className="tabs-naverpay">
              <h3>네이버페이</h3>
              <li>
                네이버페이는 네이버ID로 신용카드 또는 은행계좌 정보를 등록하여
                결제할 수 있는 간편결제 서비스입니다.
              </li>
              <li>
                주문 변경 시 카드사 혜택 및 할부 적용 여부는 해당 카드사 정책에
                따라 변경될 수 있습니다.
              </li>
              <li>
                지원 가능 결제수단 : 네이버페이 결제창 내 노출되는 모든
                카드/계좌
              </li>
            </ul>
          )}
          {activeTab === "카카오페이" && (
            <ul className="tabs-kakaopay">
              <h3>카카오페이</h3>
              <li>
                카카오페이 간편결제 혜택 및 할부 적용 여부는 해당 카드사 정책에
                따라 변경될 수 있습니다.
              </li>
              <li>
                자세한 내용은 카카오페이에서 제공하는 카드사별 정책을 확인해
                주세요.
              </li>
            </ul>
          )}
          {activeTab === "실시간계좌이체" && (
            <ul className="tabs-account-transfer">
              <h3>실시간계좌이체</h3>
              <li>실시간 계좌이체는 1,000원이상 주문 시 사용 가능합니다.</li>
              <li>
                본 결제 방식은 은행 별로 서비스 가능 시간이 다르므로 확인 후
                이용하시기 바랍니다.
              </li>
              <li>
                상품 구매와 동시에 본인 통장에서 반다이남코코리아㈜로 바로
                입금처리가 되며, 10분 이내로 입금 확인이 이루어집니다.
              </li>
              <li>
                실시간 이체 결제 신청 시 승인 진행에 다소 시간이 소요될 수
                있으므로 '중지', '새로고침'을 누르지 마시고 결과 화면이 나타날
                때까지 기다려 주십시오.
              </li>
              <li>
                실시간 이체 결제 창을 통해 입력되는 고객님의 정보는 128bit로
                안전하게 암호화되어 전송되며, 처리 후 자동 폐기됩니다.
              </li>
              <li>
                환불의 경우, 은행 영업일 기준으로 약 3~10일 정도의 시일이
                소요됩니다.
              </li>
            </ul>
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
