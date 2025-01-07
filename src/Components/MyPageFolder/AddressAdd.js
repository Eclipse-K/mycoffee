import { useState } from "react";
import axios from "axios";
import "./AddressAdd.css";

function AddressAdd({ setAddCurrentPage, refreshAddresses }) {
  const [formData, setFormData] = useState({
    addressName: "",
    name: "",
    phone: "",
    address: "",
    request: "",
  });

  const addressInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addressSubmit = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!formData.address || !formData.name || !formData.phone) {
      alert("필수 입력값을 모두 입력해주세요.");
      return;
    }

    axios
      .post("http://localhost:5001/api/addresses", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("배송지가 추가되었습니다.");
        refreshAddresses(); // 추가된 데이터를 불러오기
        setAddCurrentPage("manage"); // 배송지 관리 페이지로 전환
      })
      .catch((error) => {
        console.error("배송지 추가 실패:", error);
        alert("배송지 추가 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="address-add">
      <h2 className="address-add-title">배송지 추가</h2>
      <div className="address-add-form">
        <label>
          배송지명 <span className="required">*</span>
        </label>
        <input
          type="text"
          name="addressName"
          value={formData.addressName}
          onChange={addressInputChange}
          placeholder="예) 집, 회사"
        />
        <label>
          이름 <span className="required">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={addressInputChange}
          placeholder="이름을 입력하세요"
        />
        <label>
          전화번호 <span className="required">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={addressInputChange}
          placeholder="010-1234-5678"
        />
        <label>주소</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={addressInputChange}
          placeholder="주소를 입력하세요"
        />
        <label>요청사항</label>
        <textarea
          name="request"
          value={formData.request}
          onChange={addressInputChange}
          placeholder="배송시 요청사항을 입력하세요"
        />
      </div>
      <div className="address-add-buttons">
        <button
          className="back-btn"
          onClick={() => setAddCurrentPage("manage")}
        >
          뒤로
        </button>
        <button className="submit-btn" onClick={addressSubmit}>
          확인
        </button>
      </div>
    </div>
  );
}

export default AddressAdd;
