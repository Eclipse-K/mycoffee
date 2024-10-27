import React, { createContext, useContext, useState, useEffect } from "react";

// 장바구니 Context 생성
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // localStorage에서 장바구니 항목 불러오기
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    return storedCartItems ? storedCartItems : [];
  });

  // 장바구니 항목이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // 장바구니 항목 추가 함수
  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        // 이미 존재하는 경우 수량 증가 및 가격 업데이트
        return prevItems.map((item) =>
          item.id === newItem.id
            ? {
                ...item,
                count: item.count + 1,
                totalPrice: (
                  parseFloat(item.price.replace(/,/g, "")) *
                  (item.count + 1)
                ).toFixed(2),
              }
            : item
        );
      }
      // 새롭게 추가할 경우 초기 수량과 가격 설정
      return [
        ...prevItems,
        {
          ...newItem,
          count: 1,
          totalPrice: parseFloat(newItem.price.replace(/,/g, "")).toFixed(2),
        },
      ];
    });
  };

  // 장바구니에서 항목 제거
  const removeFromCart = (index) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// useCart 커스텀 훅을 정의하여 쉽게 장바구니 Context에 접근 가능하게 만듦
export const useCart = () => {
  return useContext(CartContext);
};
