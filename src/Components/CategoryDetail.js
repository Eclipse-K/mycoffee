import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CoffeeJson from "../Coffee.json";
import "./CategoryDetail.css";
import CoffeeAromaRadarChart from "./CoffeeAromaRadarChart";

function CategoryDetail() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [viewPageTab, setViewPageTab] = useState(0);

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
      <button className="BackButton" onClick={() => navigate(-1)}>
        뒤로
      </button>
      <h1 className="CategoryDetail-title">상세보기</h1>
      <img
        className="CategoryDetail-img"
        src={pagedetail.img}
        alt={pagedetail.title}
      />
      <h2 className="CategoryDetail-img-title">{pagedetail.title}</h2>
      <p className="CategoryDetail-img-price">가격: {pagedetail.price}원</p>
      <div className="DeliveryInfo">
        <h3>배송정보</h3>
        <p>배송비: 3,000원 (30,000원 이상 구매 시 무료)</p>
        <p>배송기간: 2~3일 소요</p>
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
          <p>배송기간: 2~3일 소요</p>
        </div>
      )}
      {viewPageTab === 2 && (
        <div className="DetailPage-TabContent">
          <h3>교환 및 반품안내</h3>
          <p>상품 수령 후 7일 이내 반품 및 교환이 가능합니다.</p>
          <p>단, 상품 개봉 후에는 교환 및 반품이 불가능합니다.</p>
        </div>
      )}
      {viewPageTab === 3 && (
        <div className="DetailPage-TabContent">
          <h3>상품후기</h3>
          <p>이 상품에 대한 후기는 아직 없습니다.</p>
        </div>
      )}
    </div>
  );
}

export default CategoryDetail;
