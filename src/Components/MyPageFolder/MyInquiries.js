import { useState, useEffect } from "react";
import axios from "axios";
import InquiryForm from "./InquiryForm"; // 작성 양식 컴포넌트 임포트
import "./MyInquiries.css";

function MyInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesPage, setInquiriesPage] = useState("list"); // 로컬 상태로 페이지 전환 관리

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios
      .get("http://localhost:5001/api/my-inquiries", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setInquiries(response.data.inquiries || []);
      })
      .catch((error) => {
        console.error("문의 데이터 불러오기 실패:", error);
        alert("문의 데이터를 가져오는 데 실패했습니다.");
      });
  }, []);

  const handleDeleteInquiry = (id) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios
      .delete(`http://localhost:5001/api/my-inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setInquiries(response.data.inquiries);
        alert("문의가 삭제되었습니다.");
      })
      .catch((error) => {
        console.error("문의 삭제 실패:", error);
        alert("문의 삭제 중 오류가 발생했습니다.");
      });
  };

  if (inquiriesPage === "form") {
    // 작성 페이지로 전환된 경우
    return (
      <InquiryForm
        setInquiriesPage={setInquiriesPage}
        setInquiries={setInquiries}
      />
    );
  }

  return (
    <div className="my-inquiries">
      <h2 className="my-inquiries-title">나의 문의</h2>
      <hr className="inquiries-divider" />
      <ul className="inquiries-list">
        {inquiries.map((inquiry) => (
          <li key={inquiry.id} className="inquiry-item">
            <h3 className="inquiry-title">{inquiry.title}</h3>
            <p className="inquiry-content">{inquiry.content}</p>
            <p className="inquiry-date">
              {new Date(inquiry.date).toLocaleString()}
            </p>
            <button
              className="inquiry-delete-btn"
              onClick={() => handleDeleteInquiry(inquiry.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      <button
        className="add-inquiry-btn"
        onClick={() => setInquiriesPage("form")}
      >
        새 문의 작성
      </button>
    </div>
  );
}

export default MyInquiries;
