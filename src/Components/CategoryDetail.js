import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CoffeeJson from "../Coffee.json";
import "./CategoryDetail.css";
import CoffeeAromaRadarChart from "./CoffeeAromaRadarChart";
import { CartContext } from "./CartContext";
import axios from "axios";

function CategoryDetail() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [viewPageTab, setViewPageTab] = useState(0);
  const { addToCart } = useContext(CartContext);
  const [showCartPopup, setShowCartPopup] = useState(false); //팝업 상태 관리
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [reviewLoggedIn, setReviewLoggedIn] = useState(false);
  const reviewUser = useRef(""); // 상태 대신 로컬 변수로 처리
  const [editingIndex, setEditingIndex] = useState(null); // 수정 중인 리뷰 인덱스
  const [editReviewContent, setEditReviewContent] = useState(""); // 수정할 내용

  useEffect(() => {
    axios.get(`/api/reviews/${id}`).then((res) => {
      setReviews(res.data || []); // 해당 상품 ID의 후기 리스트 설정
    });

    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post("/api/verify-token", { token })
        .then((res) => {
          setReviewLoggedIn(true);
          reviewUser.current = res.data.username;
        })
        .catch(() => setReviewLoggedIn(false));
    }
  }, [id]);

  const handleAddReview = () => {
    if (!newReview.trim()) return alert("후기를 입력해주세요!");
    if (!reviewLoggedIn) return alert("로그인이 필요합니다.");

    const token = localStorage.getItem("token");
    const reviewToAdd = {
      productId: id,
      reviewContent: newReview,
    };

    axios
      .post("/api/reviews", reviewToAdd, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setReviews(res.data); // 서버 응답 데이터를 상태로 설정
        setNewReview(""); // 입력 필드 초기화
      })
      .catch((err) => {
        console.error("Error adding review:", err);
        alert("후기 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  };

  const handleDeleteReview = (reviewIndex) => {
    const token = localStorage.getItem("token");

    // 삭제 요청
    axios
      .delete(`/api/reviews/${id}/${reviewIndex}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // 상태를 즉시 업데이트 (삭제된 후기 제거)
        setReviews((prevReviews) =>
          prevReviews.filter((_, index) => index !== reviewIndex)
        );
      })
      .catch((err) => {
        console.error("Error deleting review:", err);
        alert("리뷰 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  };

  const handleEditReview = (reviewIndex) => {
    setEditingIndex(reviewIndex);
    setEditReviewContent(reviews[reviewIndex].content); // 기존 리뷰 내용 가져오기
  };

  const handleSaveEditReview = () => {
    const token = localStorage.getItem("token");

    axios
      .put(
        `/api/reviews/${id}/${editingIndex}`,
        { reviewContent: editReviewContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setReviews(res.data); // 수정 후 최신 리뷰 리스트 업데이트
        setEditingIndex(null); // 수정 모드 종료
        setEditReviewContent(""); // 수정 내용 초기화
      })
      .catch((err) => {
        console.error("Error editing review:", err);
        alert("리뷰 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  };

  const detailAddToCart = () => {
    addToCart(pagedetail);
    setShowCartPopup(true);
  };

  const showClosePopup = () => {
    setShowCartPopup(false);
  };

  const detailGoCart = () => {
    navigate("/Cart");
  };

  const detailBackButton = () => {
    window.scrollTo(0, 0);
    navigate(-1);
  };

  // 유효한 category 인지 체크
  if (!CoffeeJson[category]) {
    return <div>존재하지 않는 카테고리입니다. (category: {category})</div>;
  }

  const pagedetail = CoffeeJson[category].find(
    (pagedetail) => pagedetail.id === parseInt(id)
  );

  if (!pagedetail) {
    return <div>상품을 찾을 수 없습니다. (id: {id})</div>;
  }

  const handleViewPageClick = (index) => {
    setViewPageTab(index);
  };

  return (
    <div className="CategoryDetail">
      <div className="CategoryDetail-container">
        <div className="CategoryDetail-top">
          <button className="BackButton" onClick={detailBackButton}>
            뒤로
          </button>
          <h1 className="CategoryDetail-top-title">상세보기</h1>
          <p>빈곳</p>
        </div>
        <div className="CategoryDetail-middle">
          <img
            className="CategoryDetail-img"
            src={pagedetail.img}
            alt={pagedetail.title}
          />
          <div className="CategoryDetail-middle-content">
            <h1 className="CategoryDetail-img-title">{pagedetail.title}</h1>
            <table className="DeliveryInfo">
              <tbody>
                <tr>
                  <th>판매가</th>
                  <td>{pagedetail.price}원</td>
                </tr>
                <tr>
                  <th>배송비</th>
                  <td>
                    3,000원 (30,000원 이상 무료배송) | 제주도 및 도서산간 배송비
                    3,000원 추가
                  </td>
                </tr>
                <tr>
                  <th>적립금</th>
                  <td>
                    {" "}
                    구매금액의 1% (회원 구매시) | 네이버페이 비회원 주문 건은
                    네이버페이 포인트로 적립됩니다.
                  </td>
                </tr>
                <tr>
                  <th>배송안내</th>
                  <td>
                    모든 원두는 맛과 향을 유지하기 위해 '홀빈(갈지 않은 원두)'을
                    기본으로 배송해 드립니다. 배송 메시지에 분쇄 요청해 주셔도
                    홀빈으로 발송되는 점 양해 부탁드립니다.
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="Basket-Button" onClick={detailAddToCart}>
              장바구니 담기
            </div>
            {showCartPopup && (
              <div className="CategoryDetail-Popup">
                <p>장바구니에 담겼습니다. 장바구니로 이동할까요?</p>
                <button onClick={detailGoCart}>장바구니로 이동</button>
                <button onClick={showClosePopup}>닫기</button>
              </div>
            )}
          </div>
        </div>
        <hr />
        <div className="DetailPage-Tabs">
          <button
            className={viewPageTab === 0 ? "active" : ""}
            onClick={() => handleViewPageClick(0)}
          >
            상품상세정보
          </button>
          <button
            className={viewPageTab === 1 ? "active" : ""}
            onClick={() => handleViewPageClick(1)}
          >
            배송안내
          </button>
          <button
            className={viewPageTab === 2 ? "active" : ""}
            onClick={() => handleViewPageClick(2)}
          >
            교환 및 반품안내
          </button>
          <button
            className={viewPageTab === 3 ? "active" : ""}
            onClick={() => handleViewPageClick(3)}
          >
            상품후기
          </button>
        </div>
        <hr />
        {viewPageTab === 0 && (
          <div className="DetailPage-TabContent">
            <h3>상품상세정보</h3>
            {category !== "HandDrip" && category !== "Products" && (
              <>
                <p>아로마노트: {pagedetail.flavor_note}</p>
                {pagedetail.flavorDetails && (
                  <CoffeeAromaRadarChart
                    title={pagedetail.title}
                    flavorDetails={pagedetail.flavorDetails}
                  />
                )}
              </>
            )}
            <p>특징: {pagedetail.content}</p>
          </div>
        )}
        {viewPageTab === 1 && (
          <div className="DetailPage-TabContent">
            <h3>배송안내</h3>
            <p>배송비: 3,000원 (30,000원 이상 구매 시 무료)</p>
            <p>
              모든 원두는 맛과 향을 유지하기 위해 홀빈(갈지 않은 원두)을
              기본으로 배송해 드립니다. 배송 메시지에 분쇄 요청해 주셔도
              홀빈으로 발송되는 점 양해 부탁드립니다.
            </p>
            <p>
              정해진 용량으로만 제공해 드리고 있으며, 소분은 해드리고 있지
              않습니다.
            </p>
            <p>
              주문하신 상품은 로젠택배를 통해 배송됩니다. 기본 배송비는
              3,000원이며, 3만 원 이상 주문 시 무료 배송됩니다. 제주도 및
              도서산간 지역은 기본 배송비에 3,000원이 추가됩니다. 방문 픽업은
              지원하지 않고 있습니다.
            </p>
            <p>
              일요일~목요일 주문은 익일 순차적으로 출고됩니다(택배사 휴무일
              제외). 금/토요일 주문은 차주 월요일에 출고됩니다. 택배사 사정에
              따라 배송 지연이 있을 수 있습니다.
            </p>
            <p>
              선물하기의 경우, 선물 받은 분께서 48시간 이내로 배송지를
              입력하시면 배송이 시작됩니다.
            </p>
          </div>
        )}
        {viewPageTab === 2 && (
          <div className="DetailPage-TabContent">
            <h3>교환 및 반품안내</h3>
            <p>
              받아보신 물품에 문제가 있을 경우, 배송 완료일로부터 7일 이내에
              교환 또는 반품을 요청하실 수 있습니다. 우측 하단의 채팅 상담을
              통해서 알려주세요.
            </p>
            <p>
              이용자에게 책임 있는 사유로 상품(포장 제외, 그외 부속 물품 포함)이
              훼손 또는 분실됐을 경우와, 단순 변심 또는 주문 착오에 의한 반품 및
              환불은 도와드리고 있지 않습니다.
            </p>
            <p>
              선물하기의 경우, 선물 받은 분께서 배송지 입력 전에 동일한 가격의
              옵션으로 변경할 수 있습니다.
            </p>
            <p>
              선물하기의 경우, 선물 받은 분께서 48시간 이내로 배송지를 입력하지
              않으시면 선물하신 분께 자동으로 환불 처리됩니다. 무통장입금으로
              주문하셨을 경우에는 적립금으로 환급됩니다.
            </p>
          </div>
        )}
        {viewPageTab === 3 && (
          <div className="DetailPage-TabContent">
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
                후기를 작성하려면 <a href="/login">로그인</a> 해주세요.
              </p>
            )}

            <div className="ReviewList">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="ReviewItem">
                    {editingIndex === index ? (
                      <div>
                        <textarea
                          value={editReviewContent}
                          onChange={(e) => setEditReviewContent(e.target.value)}
                        />
                        <button onClick={handleSaveEditReview}>저장</button>
                        <button onClick={() => setEditingIndex(null)}>
                          취소
                        </button>
                      </div>
                    ) : (
                      <p>{review.content}</p>
                    )}
                    <span>
                      {review.user} | {review.date}
                    </span>
                    {review.user === reviewUser.current && (
                      <div>
                        <button onClick={() => handleEditReview(index)}>
                          수정
                        </button>
                        <button onClick={() => handleDeleteReview(index)}>
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>이 상품에 대한 후기가 없습니다.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryDetail;
