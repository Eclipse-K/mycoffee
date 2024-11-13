//Cart.js
import { useContext, useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import "./Cart.css";
import { MdCancelPresentation } from "react-icons/md";
import CoffeeJson from "../Coffee.json";
import PurchasePage from "./PurchasePage";
import QuantityDropdown from "./QuantityDropdown";
import LoadingSpinner from "./LoadingSpinner";
import MiniNavbar from "./MiniNavbar";

function Cart() {
  const { cartItems, setCartItems, removeFromCart, updateCartItemQuantity } =
    useContext(CartContext);
  const [isAllChecked, setIsAllChecked] = useState(true);
  const [checkedItemIndexes, setCheckedItemIndexes] = useState(
    cartItems.map((_, index) => index)
  );
  const [loadingTime, setLoadingTime] = useState(false);
  const [showPurchasePage, setShowPurchasePage] = useState(false);

  const [totalPrice, setTotalPrice] = useState("0");

  //선택 수량에 따라 가격 업데이트
  const handleQuantityChange = (index, newQuantity) => {
    updateCartItemQuantity(index, newQuantity);
  };
  // const handleQuantityChange = (index, newQuantity) => {
  //   updateCartItemQuantity(index, newQuantity);
  //   setQuantities((prevQuantities) => {
  //     const newQuantities = [...prevQuantities];
  //     newQuantities[index] = newQuantity;
  //     return newQuantities;
  //   });
  // };

  //총 가격 계산
  // const calculateTotalPrice = useCallback(() => {
  //   return checkedItemIndexes
  //     .reduce((total, index) => {
  //       const item = cartItems[index];
  //       if (item && item.price) {
  //         const price = parseInt(item.price.replace(/,/g, ""), 10);
  //         return total + price * (item.quantity || 1);
  //       }
  //       return total;
  //     }, 0)
  //     .toLocaleString();
  // }, [checkedItemIndexes, cartItems]);

  // useEffect(() => {
  //   const newTotalPrice = cartItems.reduce((total, item) => {
  //     if (item && item.price) {
  //       return (
  //         total +
  //         parseInt(item.price.replace(/,/g, ""), 10) * (item.quantity || 1)
  //       );
  //     }
  //     return total;
  //   }, 0);
  //   setTotalPrice(newTotalPrice.toLocaleString());
  // }, [cartItems]);
  useEffect(() => {
    const newTotalPrice = cartItems.reduce((total, item) => {
      if (item && item.price) {
        return (
          total +
          parseInt(item.price.replace(/,/g, ""), 10) * (item.quantity || 1)
        );
      }
      return total;
    }, 0);
    setTotalPrice(newTotalPrice.toLocaleString());
  }, [cartItems]);

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
        // quantities,
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
      setShowPurchasePage({ show: true, checkedItemIndexes });
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
      <div className="Cart-container">
        {showPurchasePage ? (
          <PurchasePage
            checkedItemIndexes={showPurchasePage.checkedItemIndexes}
            quantities={showPurchasePage.quantities}
            onGoBack={handleGoBack}
          />
        ) : (
          <>
            <MiniNavbar />

            <h1 className="Cart-title">
              장바구니
              <hr />
            </h1>

            {cartItems.length === 0 ? (
              <p className="Cart-empty">장바구니가 비었습니다.</p>
            ) : (
              <div className="Cart-list">
                <form className="Cart-form">
                  <input
                    className="Cart-all-input"
                    type="checkbox"
                    id="AllCheck"
                    name="전체선택"
                    checked={
                      isAllChecked &&
                      checkedItemIndexes.length === cartItems.length
                    }
                    onChange={handleAllCheckboxClick}
                  />
                  <label htmlFor="AllCheck">전체 선택</label>
                </form>

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
                              item.quantity
                            ).toLocaleString()}{" "}
                            원
                          </p>
                          <QuantityDropdown
                            initialQuantity={item.quantity || 1}
                            onQuantityChange={(newQuantity) =>
                              handleQuantityChange(index, newQuantity)
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
            <p className="Cart-All-Price">총 가격: {totalPrice} 원</p>
            <div className="Cart-button-container">
              <button className="Cart-All-button" onClick={handleBuyAll}>
                전체구매
              </button>
              <button
                className="Cart-Select-button"
                onClick={handleBuySelected}
              >
                선택구매
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
