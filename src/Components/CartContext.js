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

  // 장바구니에 항목 추가
  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  // 장바구니에서 항목 제거
  const removeFromCart = (index) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// useCart 커스텀 훅을 정의하여 쉽게 장바구니 Context에 접근 가능하게 만듦
export const useCart = () => {
  return useContext(CartContext);
};
