import { useEffect, useState } from "react";
import axios from "axios";
import "./AddressManagement.css";
import AddressAdd from "./AddressAdd";

function AddressManagement() {
  const [addresses, setAddresses] = useState([]); // 배송지 목록
  const [defaultAddress, setDefaultAddress] = useState(null); // 기본 배송지 ID
  const [selectedAddress, setSelectedAddress] = useState(null); // 원 체크된 배송지 ID
  const [addCurrentPage, setAddCurrentPage] = useState("manage");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    refreshAddresses(); // 초기 데이터 로드

    // 배송지 목록 가져오기
    axios
      .get("http://localhost:5001/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data.addresses || [];
        setAddresses(data);

        // 기본 배송지를 selected 상태로 초기화
        const defaultAddr = data.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setDefaultAddress(defaultAddr.id);
          setSelectedAddress(defaultAddr.id);
        }
      })
      .catch((error) => console.error("배송지 데이터 불러오기 실패:", error));
  }, []);

  const refreshAddresses = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios
      .get("http://localhost:5001/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data.addresses || [];
        setAddresses(data);

        // 기본 배송지를 selected 상태로 초기화
        const defaultAddr = data.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setDefaultAddress(defaultAddr.id);
          setSelectedAddress(defaultAddr.id);
        }
      })
      .catch((error) => console.error("배송지 데이터 불러오기 실패:", error));
  };

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
        setDefaultAddress(selectedAddress); // 기본 배송지 갱신
      })
      .catch((error) => console.error("기본 배송지 설정 실패:", error));
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
      {addCurrentPage === "manage" ? (
        <>
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
                  <div className="address-box">
                    {defaultAddress === address.id && (
                      <span className="address-default-label">
                        기본배송
                      </span> /* 기본 배송지 표시 */
                    )}
                    <span
                      className="address-text"
                      style={{ fontWeight: "bold" }}
                    >
                      {address.addressName}
                    </span>

                    <span className="address-text">{address.name}</span>
                    <span className="address-text">{address.phone}</span>
                    <span className="address-text">{address.address}</span>
                    <span className="address-text">{address.request}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="address-controls">
            <div className="address-top-buttons">
              <button
                className="address-add-btn"
                onClick={() => setAddCurrentPage("add")}
              >
                추가
              </button>
              <button
                className="address-default-btn"
                onClick={handleSetDefaultAddress}
              >
                기본배송 설정
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
        </>
      ) : (
        <AddressAdd
          setAddCurrentPage={setAddCurrentPage}
          refreshAddresses={refreshAddresses}
        />
      )}
    </div>
  );
}

export default AddressManagement;
