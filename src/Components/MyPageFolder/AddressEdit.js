import { useState, useEffect } from "react";
import axios from "axios";
import "./AddressEdit.css";

function AddressEdit({ setAddCurrentPage, addressId, refreshAddresses }) {
  const [formData, setFormData] = useState({
    addressName: "",
    name: "",
    phone: "",
    address: "",
    request: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      setAddCurrentPage("manage");
      return;
    }

    axios
      .get(`http://localhost:5001/api/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("받은 데이터:", response.data); // 디버깅용 로그
        setFormData(response.data); // 배송지 데이터를 초기화
      })
      .catch((error) => {
        console.error("배송지 데이터 불러오기 실패:", error);
        alert("배송지 정보를 불러오는 데 실패했습니다.");
        setAddCurrentPage("manage");
      });
  }, [addressId, setAddCurrentPage]);

  const editInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const editSubmit = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios
      .put(`http://localhost:5001/api/addresses/${addressId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("배송지가 수정되었습니다.");
        refreshAddresses(); // 수정된 데이터를 불러오기
        setAddCurrentPage("manage"); // 배송지 관리 페이지로 전환
      })
      .catch((error) => {
        console.error("배송지 수정 실패:", error);
        alert("배송지 수정 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="address-edit">
      <h2 className="address-edit-title">배송지 수정</h2>
      <div className="address-edit-form">
        <label>
          배송지명 <span className="required">*</span>
        </label>
        <input
          type="text"
          name="addressName"
          value={formData.addressName}
          onChange={editInputChange}
          placeholder="예) 집, 회사"
        />
        <label>
          이름 <span className="required">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={editInputChange}
          placeholder="이름을 입력하세요"
        />
        <label>
          전화번호 <span className="required">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={editInputChange}
          placeholder="010-1234-5678"
        />
        <label>주소</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={editInputChange}
          placeholder="주소를 입력하세요"
        />
        <label>요청사항</label>
        <textarea
          name="request"
          value={formData.request}
          onChange={editInputChange}
          placeholder="배송시 요청사항을 입력하세요"
        />
      </div>
      <div className="address-edit-buttons">
        <button
          className="back-btn"
          onClick={() => setAddCurrentPage("manage")}
        >
          뒤로
        </button>
        <button className="submit-btn" onClick={editSubmit}>
          확인
        </button>
      </div>
    </div>
  );
}

export default AddressEdit;
