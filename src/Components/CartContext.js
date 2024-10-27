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

  // 장바구니에 추가하는 함수
  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        // 수량이 10개 이상이면 추가하지 않음
        if (existingItem.count >= 10) {
          alert("해당 상품은 최대 10개까지 구매할 수 있습니다.");
          return prevItems;
        }
        // 이미 존재하면 수량 증가
        return prevItems.map((item) =>
          item.id === newItem.id ? { ...item, count: item.count + 1 } : item
        );
      }
      // 새롭게 추가 (count 기본값 1)
      return [...prevItems, { ...newItem, count: 1 }];
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
