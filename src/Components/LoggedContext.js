import { createContext, useContext, useEffect, useState } from "react";

const LoggedContext = createContext();

export const LoggedProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("token")
  );

  // 상태 동기화: 컴포넌트 초기화 시 로그인 상태 확인
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token); // token이 존재하면 true, 없으면 false
  }, []);

  const login = (token, userInfo) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("id", userInfo.id);
    sessionStorage.setItem("email", userInfo.email);
    sessionStorage.setItem("username", userInfo.username);
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.clear(); // 세션 스토리지 초기화
    setIsLoggedIn(false);
  };

  return (
    <LoggedContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoggedContext.Provider>
  );
};

export const useLogged = () => useContext(LoggedContext);
