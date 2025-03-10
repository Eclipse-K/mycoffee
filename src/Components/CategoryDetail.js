import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CoffeeJson from "../Coffee.json";
import "./CategoryDetail.css";
import CoffeeAromaRadarChart from "./CoffeeAromaRadarChart";
import { CartContext } from "./CartContext";
import ReviewPage from "./ReviewPage"; // ReviewPage 추가
import axios from "axios";

function CategoryDetail() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [viewPageTab, setViewPageTab] = useState(0);
  const { addToCart } = useContext(CartContext);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false); // 위시리스트 상태
  const [uuid, setUuid] = useState(null);

  // const pagedetail = CoffeeJson[category]?.find(
  //   (item) => item.id === parseInt(id)
  // );
  const pagedetail = CoffeeJson[category].find(
    (pagedetail) => pagedetail.id === parseInt(id)
  );

  // 위시리스트 상태 확인
  useEffect(() => {
    if (pagedetail) {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return; // 토큰이 없으면 API 요청하지 않음
      }

      axios
        .get("/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const itemInWishlist = response.data.find(
            (item) => item.title === pagedetail.title
          );

          if (itemInWishlist) {
            setUuid(itemInWishlist.uuid);
            setIsInWishlist(true);
          } else {
            setUuid(null);
            setIsInWishlist(false);
          }
        })
        .catch((error) => console.error("위시리스트 상태 확인 오류:", error));
    }
  }, [pagedetail]);

  const addToWishlist = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const url = "/api/wishlist/add";
    const payload = { productId: pagedetail.id, category };

    axios
      .post(url, payload, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (Array.isArray(response.data)) {
          // 배열인 경우 UUID를 설정
          const addedItem = response.data.find(
            (item) => item.title === pagedetail.title
          );
          if (addedItem) {
            setUuid(addedItem.uuid);
            setIsInWishlist(true);
          }
        } else {
          console.error("예상치 못한 응답 형식:", response.data);
          alert("서버 응답이 올바르지 않습니다. 다시 시도해주세요.");
        }
      })
      .catch((error) => {
        console.error("위시리스트 추가 오류:", error);
        alert("위시리스트 추가 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  };

  const removeWishlist = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!uuid) {
      alert(
        "현재 상품의 UUID를 찾을 수 없습니다. 새로고침 후 다시 시도해주세요."
      );
      return;
    }

    axios
      .post(
        "/api/wishlist/remove",
        { uuid }, // UUID 전달
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setUuid(null); // UUID 초기화
        setIsInWishlist(false); // 상태 업데이트
      })
      .catch((error) => {
        console.error("위시리스트 제거 오류:", error);
        alert("위시리스트 제거 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  };

  // 유효한 category 인지 체크
  if (!CoffeeJson[category]) {
    return <div>존재하지 않는 카테고리입니다. (category: {category})</div>;
  }

  if (!pagedetail) {
    return <div>상품을 찾을 수 없습니다. (id: {id})</div>;
  }

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

  const handleViewPageClick = (index) => {
    setViewPageTab(index);
  };

  return (
    <div className="CategoryDetail">
      <div className="CategoryDetail-container">
        <div className="CategoryDetail-box">
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
                      3,000원 (30,000원 이상 무료배송) | 제주도 및 도서산간
                      배송비 3,000원 추가
                    </td>
                  </tr>
                  <tr>
                    <th>적립금</th>
                    <td>
                      구매금액의 1% (회원 구매시) | 네이버페이 비회원 주문 건은
                      네이버페이 포인트로 적립됩니다.
                    </td>
                  </tr>
                  <tr>
                    <th>배송안내</th>
                    <td>
                      모든 원두는 맛과 향을 유지하기 위해 '홀빈(갈지 않은
                      원두)'을 기본으로 배송해 드립니다. 배송 메시지에 분쇄
                      요청해 주셔도 홀빈으로 발송되는 점 양해 부탁드립니다.
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="CategoryDetail-Buttons">
                <div
                  className={`Wishlist-Button ${isInWishlist ? "active" : ""}`}
                  onClick={isInWishlist ? removeWishlist : addToWishlist}
                >
                  {isInWishlist ? "위시리스트" : "위시리스트"}
                </div>
                <div className="Deatil-Basket-Button" onClick={detailAddToCart}>
                  장바구니 담기
                </div>
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
            </div>
          )}
          {viewPageTab === 2 && (
            <div className="DetailPage-TabContent">
              <h3>교환 및 반품안내</h3>
              <p>
                받아보신 물품에 문제가 있을 경우, 배송 완료일로부터 7일 이내에
                교환 또는 반품을 요청하실 수 있습니다.
              </p>
            </div>
          )}
          {viewPageTab === 3 && <ReviewPage productTitle={pagedetail.title} />}
        </div>
      </div>
    </div>
  );
}

export default CategoryDetail;
