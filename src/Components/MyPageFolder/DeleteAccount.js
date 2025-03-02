import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DeleteAccount.css";

const DeleteAccount = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.delete(
        "http://localhost:5001/api/delete-user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setShowSuccess(true);
        sessionStorage.removeItem("token"); // 로그아웃
      }
    } catch (error) {
      console.error("회원 탈퇴 오류:", error);
    }
  };

  return (
    <div className="delete-account-page-container">
      {!showConfirm && (
        <>
          <h2>탈퇴하시겠습니까?</h2>
          <button
            onClick={() => setShowConfirm(true)}
            className="delete-account-confirm-btn"
          >
            탈퇴하기
          </button>
        </>
      )}

      {showConfirm && (
        <div className="delete-account-confirm-popup">
          <p>정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
          <button onClick={handleDelete}>확인</button>
          <button onClick={() => setShowConfirm(false)}>취소</button>
        </div>
      )}

      {showSuccess && (
        <div className="delete-account-success-popup">
          <p>회원 탈퇴가 완료되었습니다.</p>
          <button onClick={() => navigate("/")}>확인</button>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
