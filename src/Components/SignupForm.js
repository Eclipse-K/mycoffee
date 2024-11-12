import React, { useState } from "react";
import "./SignupForm.css";
import { Link } from "react-router-dom";
import StyledLogo from "./StyledLogo";
import Logo from "../images/Logo_MyCoffee.png";

function SignupForm() {
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    year: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.id) formErrors.id = "아이디를 작성해주세요.";
    if (!formData.email) formErrors.email = "Email을 작성해주세요.";
    if (!formData.password) formErrors.password = "비밀번호를 작성해주세요.";
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    if (!formData.username) formErrors.username = "이름을 작성해주세요.";
    if (!formData.year) formErrors.year = "생년월일을 작성해주세요.";
    if (!formData.phone)
      formErrors.phone = "휴대폰 번호는 필수 입력 정보입니다.";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5001/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.success) {
          alert("회원가입이 완료되었습니다.");
          console.log("Form submitted:", formData);
          // 필요시 form 초기화
          setFormData({
            id: "",
            email: "",
            password: "",
            confirmPassword: "",
            username: "",
            year: "",
            phone: "",
          });
        } else {
          alert("회원가입 중 문제가 발생했습니다.");
        }
      } catch (error) {
        console.error("회원가입 실패:", error);
        alert("서버 연결에 문제가 발생했습니다.");
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handlePhoneVerification = (e) => {
    e.preventDefault();
    let formErrors = {};
    if (!formData.phone) {
      formErrors.phone = "휴대폰 번호는 필수 입력 정보입니다.";
      setErrors(formErrors);
    } else {
      // 휴대폰 번호 인증 로직 추가 (예: API 호출)
      console.log("Phone verification requested:", formData.phone);
      // 인증 로직 성공 시 에러 메시지 초기화
      setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
    }
  };

  return (
    <div className="Sign">
      <div className="Sign-Container">
        <nav className="Sign-nav">
          <Link className="Sign-nav-logo-img" to="/">
            <StyledLogo src={Logo} alt="Logo" />
            <h4>회원가입</h4>
          </Link>

          <Link className="Sign-nav-login" to="/Login">
            <h4>MyCoffee Login</h4>
          </Link>
        </nav>
        <div className="Sign-body">
          <form className="Sign-box" onSubmit={handleSubmit}>
            <div className="Sign-area">
              <label className="Sign-label">아이디</label>
              <input
                className="Sign-input"
                type="id"
                name="id"
                placeholder="4~20자리 / 영문, 숫자, 특수문자'_'사용가능"
                value={formData.id}
                onChange={handleChange}
              />
              {errors.id && <p>{errors.id}</p>}
            </div>

            <div className="Sign-area">
              <label className="Sign-label">비밀번호</label>
              <label className="Sign-label-2">
                (8자 ,특수문자 하나 이상 포함)
              </label>
              <input
                className="Sign-input"
                type="password"
                name="password"
                placeholder="8~16자리 / 영문 대소문자, 숫자, 특수문자 조합"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p>{errors.password}</p>}
            </div>
            <div className="Sign-area">
              <label className="Sign-label">비밀번호 확인</label>
              <input
                className="Sign-input"
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            </div>

            <div className="Sign-area">
              <label className="Sign-label">이름</label>
              <input
                className="Sign-input"
                type="username"
                name="username"
                placeholder="이름 입력"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <p>{errors.username}</p>}
            </div>

            <div className="Sign-area">
              <label className="Sign-label">생년월일</label>
              <input
                className="Sign-input"
                type="year"
                name="year"
                placeholder="YYYYMMDD"
                value={formData.year}
                onChange={handleChange}
              />
              {errors.year && <p>{errors.year}</p>}
            </div>

            <div className="Sign-area">
              <label className="Sign-label">휴대폰</label>
              <div id="Sign-phone">
                <input
                  className="Sign-input"
                  id="phone-input"
                  type="phone"
                  name="phone"
                  placeholder="'_'빼고 숫자만 입력"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <button
                  className="Sign-phone-button"
                  onClick={handlePhoneVerification}
                >
                  인증요청
                </button>
              </div>
              {errors.phone && <p>{errors.phone}</p>}
            </div>

            <div className="Sign-area">
              <label className="Sign-label">Email</label>
              <input
                className="Sign-input"
                type="email"
                name="email"
                placeholder="example@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p>{errors.email}</p>}
            </div>
            <div className="Sign-submit">
              <button type="submit">회원가입 완료</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
