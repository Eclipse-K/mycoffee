import { createContext, useContext, useEffect, useState } from "react";

const LoggedContext = createContext();

export const LoggedProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // 상태 동기화: 컴포넌트 초기화 시 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // token이 존재하면 true, 없으면 false
  }, []);

  const login = (token, userInfo) => {
    localStorage.setItem("token", token);
    localStorage.setItem("id", userInfo.id);
    localStorage.setItem("email", userInfo.email);
    localStorage.setItem("username", userInfo.username);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  return (
    <LoggedContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoggedContext.Provider>
  );
};

export const useLogged = () => useContext(LoggedContext);
