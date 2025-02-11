import { useState, useEffect } from "react";
import axios from "axios";
import "./PostManagement.css";

function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios
      .get("http://localhost:5001/api/my-posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const reviewsData = response.data.reviews || {};
        const reviewsArray = Object.values(reviewsData).flat(); // 객체 값을 배열로 변환
        setPosts(reviewsArray); // 변환된 배열로 상태 설정
      })
      .catch((error) => {
        console.error("게시물 불러오기 실패:", error);
        alert("게시물을 불러오는 중 오류가 발생했습니다.");
      });
  }, []);

  // 게시물 삭제
  const handleDeletePosts = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 선택한 게시물 삭제
    axios
      .delete("http://localhost:5001/api/my-posts", {
        data: { postIds: selectedPosts },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const updatedPosts = response.data.reviews || {}; // 서버 응답 데이터 확인
        const postsArray = Object.values(updatedPosts).flat(); // 객체를 배열로 변환
        setPosts(postsArray); // 변환된 배열로 상태 갱신
        setSelectedPosts([]); // 선택 목록 초기화
        alert("선택한 게시물이 삭제되었습니다.");
      })
      .catch((error) => {
        console.error("게시물 삭제 실패:", error);
        alert("게시물 삭제 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="PostManagement">
      <h2 className="PostManagement-title">나의 게시물 관리</h2>
      <hr className="PostManagement-hr" />
      <ul className="PostManagement-box">
        {posts.map((post, index) => (
          <li className="PostManagement-list" key={index}>
            <input
              type="checkbox"
              checked={selectedPosts.includes(index)}
              onChange={() =>
                setSelectedPosts((prev) =>
                  prev.includes(index)
                    ? prev.filter((id) => id !== index)
                    : [...prev, index]
                )
              }
            />
            <div className="PostManagement-content">
              <div className="PostManagement-content-img-text">
                <img
                  src={post.imgUrl}
                  alt={post.productTitle}
                  className="PostManagement-img"
                />
                <p>{post.content}</p>
              </div>
              <div className="PostManagement-content-date">{post.date}</div>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="PostManagement-delete-button"
        onClick={handleDeletePosts}
        disabled={selectedPosts.length === 0}
      >
        선택 삭제
      </button>
    </div>
  );
}

export default PostManagement;
