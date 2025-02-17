import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import "./ReviewPage.css";

function ReviewPage({ productTitle }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [reviewLoggedIn, setReviewLoggedIn] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editReviewContent, setEditReviewContent] = useState("");
  const [productImgUrl, setProductImgUrl] = useState(""); // 상품 이미지 URL 저장
  const reviewUser = useRef("");
  const token = sessionStorage.getItem("token");

  // 현재 상품의 이미지 URL 가져오기
  useEffect(() => {
    axios
      .get(`/api/product/${encodeURIComponent(productTitle)}`)
      .then((res) => {
        if (res.data.success && res.data.product) {
          setProductImgUrl(res.data.product.img);
        }
      })
      .catch((err) => console.error("상품 이미지 불러오기 실패:", err));
  }, [productTitle]);

  // 리뷰 불러오기 (로그인 여부와 상관없이 접근 가능)
  useEffect(() => {
    axios
      .get(`/api/reviews/${encodeURIComponent(productTitle)}`)
      .then((res) => {
        const reviewsArray = res.data.reviews || [];
        setReviews(
          Array.isArray(reviewsArray)
            ? reviewsArray
            : Object.values(reviewsArray).flat()
        );
      })
      .catch((err) => console.error("Failed to load reviews:", err));
  }, [productTitle]);

  // 로그인 상태 확인
  useEffect(() => {
    if (!token) return;

    axios
      .post("/api/verify-token", { token })
      .then((res) => {
        if (res.data.success) {
          setReviewLoggedIn(true);
          reviewUser.current = res.data.username;
        }
      })
      .catch(() => setReviewLoggedIn(false));
  }, [token]);

  // 리뷰 작성
  const handleAddReview = () => {
    if (!newReview.trim()) return alert("후기를 입력해주세요!");
    if (!reviewLoggedIn) return alert("로그인이 필요합니다.");
    if (!productImgUrl) return alert("상품 이미지를 찾을 수 없습니다.");
    if (!token) return alert("로그인이 필요합니다.");

    const newReviewData = {
      user: reviewUser.current,
      content: newReview,
      date: new Date().toISOString().split("T")[0], // 현재 날짜 추가
      imgUrl: productImgUrl,
    };

    axios
      .post(
        "/api/reviews",
        {
          productId: productTitle,
          reviewContent: newReview,
          imgUrl: productImgUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setReviews((prevReviews) => [...prevReviews, newReviewData]); // 새 리뷰를 기존 목록에 추가
        setNewReview(""); // 입력 필드 초기화
      })
      .catch(() => alert("후기 작성 중 오류가 발생했습니다."));
  };

  // 리뷰 삭제
  const handleDeleteReview = (index) => {
    if (!token) return alert("로그인이 필요합니다.");

    axios
      .delete(`/api/reviews/${encodeURIComponent(productTitle)}/${index}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setReviews((prevReviews) => prevReviews.filter((_, i) => i !== index));
      })
      .catch(() => alert("리뷰 삭제 중 오류가 발생했습니다."));
  };

  // 리뷰 수정 시작
  const handleEditReview = (index) => {
    setEditingIndex(index);
    setEditReviewContent(reviews[index].content);
  };

  // 리뷰 수정 저장
  const handleSaveEditReview = () => {
    if (!token) return alert("로그인이 필요합니다.");

    axios
      .put(
        `/api/reviews/${encodeURIComponent(productTitle)}/${editingIndex}`,
        { reviewContent: editReviewContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setReviews((prevReviews) =>
          prevReviews.map((review, index) =>
            index === editingIndex
              ? { ...review, content: editReviewContent }
              : review
          )
        );
        setEditingIndex(null);
        setEditReviewContent("");
      })
      .catch(() => alert("리뷰 수정 중 오류가 발생했습니다."));
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
              {review.imgUrl && (
                <img
                  src={review.imgUrl}
                  alt="리뷰 이미지"
                  className="ReviewImage"
                />
              )}
              {editingIndex === index ? (
                <div className="ReviewItem-box">
                  <textarea
                    className="ReviewItem-textarea"
                    value={editReviewContent}
                    onChange={(e) => setEditReviewContent(e.target.value)}
                  />
                  <div className="ReviewActions">
                    <FaCheck
                      className="ReviewItem-Save"
                      onClick={handleSaveEditReview}
                    />
                    <MdOutlineCancel
                      className="ReviewItem-Cancel"
                      onClick={() => setEditingIndex(null)}
                    />
                  </div>
                </div>
              ) : (
                <div className="ReviewItem-box">
                  <div className="ReviewItem-Content">
                    <p className="ReviewContent">{review.content}</p>
                    <span>
                      {review.user} | {review.date}
                    </span>
                  </div>
                  {review.user === reviewUser.current && (
                    <div className="ReviewActions">
                      <CiEdit
                        className="ReviewItem-Edit"
                        onClick={() => handleEditReview(index)}
                      />
                      <RiDeleteBin5Line
                        className="ReviewItem-Cancel"
                        onClick={() => handleDeleteReview(index)}
                      />
                    </div>
                  )}
                </div>
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
