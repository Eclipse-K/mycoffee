import { useState, useEffect } from "react";
import "./EditUserInfo.css";

function EditUserInfo() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    id: "",
    birthdate: "",
    phone: "",
    address: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState({
    phone: false,
    address: false,
    email: false,
  });
  const [editValues, setEditValues] = useState({
    phone: "",
    address: "",
    email: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // 세션스토리지에서 토큰 가져오기
    if (!token) {
      console.error("No logged in user found");
      return;
    }

    fetch("http://localhost:5001/api/get-user-info", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // 토큰 포함
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setUserInfo(data.userInfo);
        } else {
          alert(data.message || "유저 정보를 가져오는 데 실패했습니다.");
        }
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }, []);

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));

    if (isEditing[field]) {
      // 수정 요청 데이터 구성
      const updateData = {
        id: userInfo.id, // 사용자 고유 ID
        [field]: editValues[field], // 수정할 필드와 값
      };

      // 빈 입력 값 방지
      if (!editValues[field].trim()) {
        alert(`${field} 값을 입력해주세요.`);
        return;
      }

      // 수정 요청
      fetch("http://localhost:5001/api/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // 세션스토리지에서 토큰 가져오기
        },
        body: JSON.stringify(updateData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUserInfo((prev) => ({ ...prev, [field]: editValues[field] }));
            alert(`${field}가 성공적으로 수정되었습니다.`);
          } else {
            alert(data.message || `${field} 수정 실패`);
          }
        })
        .catch((error) => console.error("Update error:", error));
    }
  };

  return (
    <div className="edit-user-info">
      <h2>회원정보 수정</h2>
      <table>
        <tbody>
          <tr>
            <td>이름</td>
            <td>{userInfo.username}</td>
          </tr>
          <tr>
            <td>회원 아이디</td>
            <td>{userInfo.id}</td>
          </tr>
          <tr>
            <td>비밀번호</td>
            <td>
              <button onClick={() => alert("비밀번호 변경 기능 구현 필요")}>
                비밀번호 변경
              </button>
            </td>
          </tr>
          <tr>
            <td>생년월일</td>
            <td>{userInfo.birthdate}</td>
          </tr>
          <tr>
            <td>핸드폰 번호</td>
            <td>
              {isEditing.phone ? (
                <input
                  type="text"
                  value={editValues.phone}
                  onChange={(e) => handleEditChange("phone", e.target.value)}
                />
              ) : (
                userInfo.phone
              )}
              <button onClick={() => handleEditToggle("phone")}>
                {isEditing.phone ? "저장" : "변경"}
              </button>
            </td>
          </tr>
          <tr>
            <td>주소</td>
            <td>
              {isEditing.address ? (
                <input
                  type="text"
                  value={editValues.address}
                  onChange={(e) => handleEditChange("address", e.target.value)}
                />
              ) : (
                userInfo.address
              )}
              <button onClick={() => handleEditToggle("address")}>
                {isEditing.address ? "저장" : "변경"}
              </button>
            </td>
          </tr>
          <tr>
            <td>이메일</td>
            <td>
              {isEditing.email ? (
                <input
                  type="email"
                  value={editValues.email}
                  onChange={(e) => handleEditChange("email", e.target.value)}
                />
              ) : (
                userInfo.email
              )}
              <button onClick={() => handleEditToggle("email")}>
                {isEditing.email ? "저장" : "변경"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default EditUserInfo;
