import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import "./ReviewPage.css";

function ReviewPage({ productTitle }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [reviewLoggedIn, setReviewLoggedIn] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editReviewContent, setEditReviewContent] = useState("");
  const reviewUser = useRef("");

  // 리뷰 불러오기 및 로그인 상태 확인
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // 리뷰 가져오기
    axios
      .get(`/api/reviews/${encodeURIComponent(productTitle)}`)
      .then((res) => setReviews(res.data || []))
      .catch((err) => console.error("Failed to load reviews:", err));

    // 로그인 상태 확인
    if (token) {
      axios
        .post("/api/verify-token", { token })
        .then((res) => {
          setReviewLoggedIn(true);
          reviewUser.current = res.data.username;
        })
        .catch(() => setReviewLoggedIn(false));
    }
  }, [productTitle]);

  // 리뷰 작성
  const handleAddReview = () => {
    if (!newReview.trim()) return alert("후기를 입력해주세요!");
    if (!reviewLoggedIn) return alert("로그인이 필요합니다.");

    const token = sessionStorage.getItem("token");
    axios
      .post(
        "/api/reviews",
        { productId: productTitle, reviewContent: newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setReviews(res.data);
        setNewReview("");
      })
      .catch((err) => {
        console.error("Error adding review:", err);
        alert("후기 작성 중 오류가 발생했습니다.");
      });
  };

  // 리뷰 삭제
  const handleDeleteReview = (index) => {
    const token = sessionStorage.getItem("token");
    axios
      .delete(`/api/reviews/${encodeURIComponent(productTitle)}/${index}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReviews(res.data))
      .catch((err) => {
        console.error("Error deleting review:", err);
        alert("리뷰 삭제 중 오류가 발생했습니다.");
      });
  };

  // 리뷰 수정 시작
  const handleEditReview = (index) => {
    setEditingIndex(index);
    setEditReviewContent(reviews[index].content);
  };

  // 리뷰 수정 저장
  const handleSaveEditReview = () => {
    const token = sessionStorage.getItem("token");
    axios
      .put(
        `/api/reviews/${encodeURIComponent(productTitle)}/${editingIndex}`,
        { reviewContent: editReviewContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setReviews(res.data);
        setEditingIndex(null);
        setEditReviewContent("");
      })
      .catch((err) => {
        console.error("Error editing review:", err);
        alert("리뷰 수정 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="ReviewPage">
      <h3>상품후기</h3>
      {reviewLoggedIn ? (
        <div className="ReviewForm">
          <textarea
            placeholder="후기를 작성해주세요"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <button onClick={handleAddReview}>작성</button>
        </div>
      ) : (
        <p>
          후기를 작성하려면 <Link to="/Login">로그인</Link> 해주세요.
        </p>
      )}
      <hr />
      <div className="ReviewList">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="ReviewItem">
              {editingIndex === index ? (
                <div className="ReviewItem-box">
                  <textarea
                    className="ReviewItem-textarea"
                    value={editReviewContent}
                    onChange={(e) => setEditReviewContent(e.target.value)}
                  />
                  <div className="ReviewActions">
                    <button
                      className="ReviewItem-Save"
                      onClick={handleSaveEditReview}
                    >
                      저장
                    </button>
                    <button
                      className="ReviewItem-Cancer"
                      onClick={() => setEditingIndex(null)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="ReviewItem-box">
                    <p className="ReviewContent">{review.content}</p>
                    <span>
                      {review.user} | {review.date}
                    </span>
                  </div>
                  {review.user === reviewUser.current && (
                    <div className="ReviewActions">
                      <CiEdit onClick={() => handleEditReview(index)} />
                      <RiDeleteBin5Line
                        onClick={() => handleDeleteReview(index)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p>이 상품에 대한 후기가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default ReviewPage;
