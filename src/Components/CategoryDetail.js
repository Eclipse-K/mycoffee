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
      <div className="CategoryDetail-container">
        <div className="CategoryDetail-top">
          <button className="BackButton" onClick={() => navigate(-1)}>
            뒤로
          </button>
          <h1 className="CategoryDetail-top-title">상세보기</h1>
          <p>빈곳</p>
        </div>
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
              <p>
                이용자에게 책임 있는 사유로 상품(포장 제외, 그외 부속 물품
                포함)이 훼손 또는 분실됐을 경우와, 단순 변심 또는 주문 착오에
                의한 반품 및 환불은 도와드리고 있지 않습니다.
              </p>
              <p>
                선물하기의 경우, 선물 받은 분께서 배송지 입력 전에 동일한 가격의
                옵션으로 변경할 수 있습니다.
              </p>
              <p>
                선물하기의 경우, 선물 받은 분께서 48시간 이내로 배송지를
                입력하지 않으시면 선물하신 분께 자동으로 환불 처리됩니다.
                무통장입금으로 주문하셨을 경우에는 적립금으로 환급됩니다.
              </p>
            </p>
          </div>
        )}
        {viewPageTab === 3 && (
          <div className="DetailPage-TabContent">
            <h3>상품후기</h3>
            <p>이 상품에 대한 후기는 아직 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryDetail;
