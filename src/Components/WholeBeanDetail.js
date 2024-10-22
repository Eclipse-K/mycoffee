import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CoffeeJson from "../Coffee.json";
import "./WholeBeanDetail.css";

function WholeBeanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const whole = CoffeeJson.WholeBean.find((item) => item.id === parseInt(id));

  // 현재 활성화된 탭을 관리하는 상태
  const [activeTab, setActiveTab] = useState(0);

  if (!whole) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  // 탭 변경 함수
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="WholeBeanDetail">
      {/* 뒤로 가기 버튼 */}
      <button className="BackButton" onClick={() => navigate(-1)}>
        뒤로 가기
      </button>
      <h1>상세보기</h1>
      <img className="WholeBeanDetail-img" src={whole.img} alt={whole.title} />
      <h2>{whole.title}</h2>
      <p>가격: {whole.price}</p>
      {/* 배송 정보 */}
      <div className="DeliveryInfo">
        <h3>배송정보</h3>
        <p>배송비: 3,000원 (30,000원 이상 구매 시 무료)</p>
        <p>배송기간: 2~3일 소요</p>
      </div>
      <hr /> {/* 구분선 */}
      {/* 탭 메뉴 */}
      <div className="Tabs">
        <button
          className={activeTab === 0 ? "active" : ""}
          onClick={() => handleTabClick(0)}
        >
          상품상세정보
        </button>
        <button
          className={activeTab === 1 ? "active" : ""}
          onClick={() => handleTabClick(1)}
        >
          배송안내
        </button>
        <button
          className={activeTab === 2 ? "active" : ""}
          onClick={() => handleTabClick(2)}
        >
          교환 및 반품안내
        </button>
        <button
          className={activeTab === 3 ? "active" : ""}
          onClick={() => handleTabClick(3)}
        >
          상품후기
        </button>
      </div>
      <hr />
      {/* 탭 내용 */}
      {activeTab === 0 && (
        <div className="TabContent">
          <h3>상품상세정보</h3>
          <p>아로마노트: {whole.flavor_note}</p>
          <p>특징: {whole.content}</p>
        </div>
      )}
      {activeTab === 1 && (
        <div className="TabContent">
          <h3>배송안내</h3>
          <p>배송비: 3,000원 (30,000원 이상 구매 시 무료)</p>
          <p>배송기간: 2~3일 소요</p>
        </div>
      )}
      {activeTab === 2 && (
        <div className="TabContent">
          <h3>교환 및 반품안내</h3>
          <p>상품 수령 후 7일 이내 반품 및 교환이 가능합니다.</p>
          <p>단, 상품 개봉 후에는 교환 및 반품이 불가능합니다.</p>
        </div>
      )}
      {activeTab === 3 && (
        <div className="TabContent">
          <h3>상품후기</h3>
          <p>이 상품에 대한 후기는 아직 없습니다.</p>
        </div>
      )}
    </div>
  );
}

export default WholeBeanDetail;
