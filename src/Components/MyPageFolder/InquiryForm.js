import { useState } from "react";
import axios from "axios";
import "./MyInquiries.css";

function InquiryForm({ setInquiriesPage, setInquiries }) {
  const [formData, setFormData] = useState({ title: "", content: "" });

  const inquiriesInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inquiriesSubmit = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!formData.title || !formData.content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    axios
      .post("http://localhost:5001/api/my-inquiries", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setInquiries(response.data.inquiries); // 목록 갱신
        setInquiriesPage("list"); // 목록 페이지로 전환
        alert("문의가 추가되었습니다.");
      })
      .catch((error) => {
        console.error("문의 추가 실패:", error.response?.data || error.message);
        alert("문의 추가 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="inquiry-form">
      <h2 className="inquiry-form-title">새 문의 작성</h2>
      <hr />
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={inquiriesInputChange}
        placeholder="문의 제목"
        className="inquiry-input"
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={inquiriesInputChange}
        placeholder="문의 내용"
        className="inquiry-textarea"
      />
      <div className="inquiry-buttons">
        <button className="inquiry-submit-btn" onClick={inquiriesSubmit}>
          작성
        </button>
        <button
          className="back-btn"
          onClick={() => setInquiriesPage("list")} // 목록 페이지로 전환
        >
          뒤로
        </button>
      </div>
    </div>
  );
}

export default InquiryForm;
