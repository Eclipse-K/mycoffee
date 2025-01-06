import { useEffect, useState } from "react";
import axios from "axios";
import "./AddressManagement.css";

function AddressManagement() {
  const [addresses, setAddresses] = useState([]); // 배송지 목록
  const [defaultAddress, setDefaultAddress] = useState(null); // 기본 배송지 ID
  const [selectedAddress, setSelectedAddress] = useState(null); // 원 체크된 배송지 ID

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 배송지 목록 가져오기
    axios
      .get("http://localhost:5001/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data.addresses || [];
        setAddresses(data);
        const defaultAddr = data.find((addr) => addr.isDefault);
        setDefaultAddress(defaultAddr ? defaultAddr.id : null);
      })
      .catch((error) => console.error("배송지 데이터 불러오기 실패:", error));
  }, []);

  const handleSetDefaultAddress = () => {
    if (!selectedAddress) {
      alert("배송지를 선택해주세요.");
      return;
    }

    const token = sessionStorage.getItem("token");
    axios
      .put(
        `http://localhost:5001/api/addresses/${selectedAddress}/default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setAddresses(response.data.addresses);
        setDefaultAddress(selectedAddress);
      })
      .catch((error) => console.error("기본 배송지 설정 실패:", error));
  };

  const handleAddAddress = () => {
    window.location.href = "/add-address"; // 새 페이지로 이동
  };

  const handleDeleteAddress = (id) => {
    const token = sessionStorage.getItem("token");
    axios
      .delete(`http://localhost:5001/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAddresses(response.data.addresses);
      })
      .catch((error) => console.error("배송지 삭제 실패:", error));
  };

  return (
    <div className="address-management">
      <h2 className="address-management-title">배송지 관리</h2>
      <hr className="address-divider" /> {/* 구분선 추가 */}
      <ul className="address-container">
        {addresses.map((address) => (
          <li
            className={`address-list ${
              selectedAddress === address.id ? "address-list--selected" : ""
            }`}
            key={address.id}
            onClick={() => setSelectedAddress(address.id)}
          >
            {defaultAddress === address.id && (
              <span className="default-label">
                [기본 배송지]
              </span> /* 기본 배송지 표시 */
            )}
            <div className="address-content">
              <div className="address-circle">
                <input
                  type="radio"
                  name="address"
                  className="address-radio"
                  checked={selectedAddress === address.id}
                  onChange={() => setSelectedAddress(address.id)}
                />
              </div>
              <span className="address-text">{address.address}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="address-controls">
        <div className="address-top-buttons">
          <button
            className="address-add-btn"
            onClick={() => (window.location.href = "/add-address")}
          >
            추가
          </button>
          <button
            className="address-default-btn"
            onClick={handleSetDefaultAddress}
          >
            기본 배송지 설정
          </button>
        </div>
        <div className="address-bottom-buttons">
          <button className="address-edit-btn">수정</button>
          <button
            className="address-delete-btn"
            onClick={() =>
              selectedAddress && handleDeleteAddress(selectedAddress)
            }
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddressManagement;
