import React, { useState } from "react";
import "./SignupForm.css";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (!formData.id) formErrors.username = "아이디를 작성해주세요.";
    if (!formData.email) formErrors.email = "Email을 작성해주세요.";
    if (!formData.password) formErrors.password = "비밀번호를 작성해주세요.";
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      console.log("Form submitted:", formData);
      // 회원가입 로직 추가 (예: API 호출)
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="Sign">
      <form className="Sign-Container" onSubmit={handleSubmit}>
        <div className="Sign-area">
          <label className="Sign-label">아이디</label>
          <input
            className="Sign-input"
            type="text"
            name="id"
            placeholder="example@example.com"
            value={formData.id}
            onChange={handleChange}
          />
          {errors.username && <p>{errors.username}</p>}
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
        <div className="Sign-area">
          <label className="Sign-label">비밀번호</label>
          <label className="Sign-label-2">(8자 ,특수문자 하나 이상 포함)</label>
          <input
            className="Sign-input"
            type="password"
            name="password"
            placeholder="비밀번호"
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupForm;
