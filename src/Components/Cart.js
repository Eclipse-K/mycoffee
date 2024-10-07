import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import Logo from "../images/Logo_MyCoffee.png";
import "./Cart.css";
import { Link } from "react-router-dom";
import { MdCancelPresentation } from "react-icons/md";
import CoffeeJson from "../Coffee.json";
import PurchasePage from "./PurchasePage";
import QuantityDropdown from "./QuantityDropdown";
import LoadingSpinner from "./LoadingSpinner";

function Cart() {
  const { cartItems, setCartItems, removeFromCart } = useContext(CartContext);
  const [isAllChecked, setIsAllChecked] = useState(true);
  const [checkedItemIndexes, setCheckedItemIndexes] = useState(
    cartItems.map((_, index) => index)
  );
  const [loadingTime, setLoadingTime] = useState(false);
  const [showPurchasePage, setShowPurchasePage] = useState(false);
  const [quantities, setQuantities] = useState(cartItems.map(() => 1));

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

  // API 호출하여 count 업데이트
  const updateCount = (id, category) => {
    fetch("/api/update-count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, category }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, count: data.updatedItem.count } : item
            )
          );
          console.log("Updated item:", data.updatedItem);
        }
      })
      .catch((error) => {
        console.error("Error updating count:", error);
      });
  };

  // 전체 구매 핸들러
  const handleBuyAll = () => {
    if (cartItems.length === 0) {
      // 목록이 없으면 팝업창을 띄운다.
      alert("목록이 존재하지 않습니다.");
      return;
    }

    cartItems.forEach((item) => {
      const category = determineCategory(item.id); // 상품의 카테고리를 확인
      updateCount(item.id, category); // count 업데이트
    });

    setLoadingTime(true);
    setCheckedItemIndexes(cartItems.map((_, index) => index));
    setTimeout(() => {
      setLoadingTime(false);
      setShowPurchasePage({
        show: true,
        checkedItemIndexes: cartItems.map((_, index) => index),
        quantities,
      });
    }, 2000);
  };

  // 선택 구매 핸들러
  const handleBuySelected = () => {
    if (checkedItemIndexes.length === 0) {
      // 선택한 항목이 없을 때 팝업창을 띄운다.
      alert("목록이 존재하지 않습니다.");
      return;
    }

    checkedItemIndexes.forEach((index) => {
      const item = cartItems[index];
      const category = determineCategory(item.id);
      updateCount(item.id, category);
    });

    setLoadingTime(true);
    setTimeout(() => {
      setLoadingTime(false);
      setShowPurchasePage({ show: true, checkedItemIndexes, quantities });
    }, 2000);
  };

  const handleGoBack = () => {
    setShowPurchasePage(false);
  };

  if (loadingTime) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  //선택 수량에 따라 가격 업데이트
  const handleQuantityChange = (index, quantity) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = quantity;
    setQuantities(updatedQuantities);
  };

  //총 가격 계산
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item, index) => {
      const price = parseFloat(item.price.replace(/,/g, "")); // 콤마 제거 후 숫자로 변환
      const quantity = quantities[index] || 1; // 수량이 없다면 기본값 1
      return total + price * quantity;
    }, 0);
  };

  // 카테고리 확인 함수
  const determineCategory = (id) => {
    if (CoffeeJson.WholeBean.some((item) => item.id === id)) return "WholeBean";
    if (CoffeeJson.DripBag.some((item) => item.id === id)) return "DripBag";
    if (CoffeeJson.HandDrip.some((item) => item.id === id)) return "HandDrip";
    if (CoffeeJson.Products.some((item) => item.id === id)) return "Products";
    return null;
  };

  return (
    <div className="Cart">
      {showPurchasePage ? (
        <PurchasePage
          checkedItemIndexes={showPurchasePage.checkedItemIndexes}
          quantities={showPurchasePage.quantities}
          onGoBack={handleGoBack}
        />
      ) : (
        <>
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
                  <div className="Cart-area-first">
                    <div className="Cart-area-second">
                      <p className="Cart-area-title">{item.title}</p>
                      <div className="Cart-area-third">
                        <p className="Cart-area-price">
                          {(
                            parseInt(item.price.replace(/,/g, ""), 10) *
                            quantities[index]
                          ).toString()}{" "}
                        </p>
                        <QuantityDropdown
                          onQuantityChange={(quantity) =>
                            handleQuantityChange(index, quantity)
                          }
                        />
                      </div>
                    </div>
                    <div className="Cart-remove">
                      <MdCancelPresentation
                        onClick={() => removeFromCart(index)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="Cart-All-Price">총 가격: {calculateTotalPrice()} 원</p>
          <div className="Cart-button-container">
            <button className="Cart-All-button" onClick={handleBuyAll}>
              전체구매
            </button>
            <button className="Cart-Select-button" onClick={handleBuySelected}>
              선택구매
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
