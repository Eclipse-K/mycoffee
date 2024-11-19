import { useState } from "react";
import "./OrderInquiry.css";
import { useEffect } from "react";

function OrderInquiry({ orderActive, setOrderActive }) {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 기본값을 오늘 날짜로 설정
    const today = new Date().toISOString().split("T")[0];
    setDateRange({ startDate: today, endDate: today });
  }, []);

  const handleTabClick = (tab) => {
    setOrderActive(tab);
  };

  const handleQuickDateSelect = (months) => {
    const endDate = new Date(); // 오늘 날짜
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // 날짜 범위 설정 및 달력 반영
    setDateRange({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="order-inquiry">
      <h1 className="order-inquiry-title">주문조회</h1>

      <hr />
      <div className="order-inquiry-content">
        <div className="order-inquiry-tabs">
          <button
            className={orderActive === "orderHistory" ? "active" : ""}
            onClick={() => handleTabClick("orderHistory")}
          >
            주문내역조회 (0)
          </button>
          <button
            className={orderActive === "cancelHistory" ? "active" : ""}
            onClick={() => handleTabClick("cancelHistory")}
          >
            취소/반품/교환 내역 (0)
          </button>
          <button
            className={orderActive === "pastOrderHistory" ? "active" : ""}
            onClick={() => handleTabClick("pastOrderHistory")}
          >
            과거주문내역 (0)
          </button>
        </div>

        {/* 날짜 선택 */}
        <div className="order-inquiry-calendar">
          <div className="order-inquiry-calendar-date">
            <button onClick={() => handleQuickDateSelect(0)}>오늘</button>
            <button onClick={() => handleQuickDateSelect(0.25)}>1주일</button>
            <button onClick={() => handleQuickDateSelect(1)}>1개월</button>
            <button onClick={() => handleQuickDateSelect(3)}>3개월</button>
            <button onClick={() => handleQuickDateSelect(6)}>6개월</button>
          </div>
          <div className="order-inquiry-date-range">
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
            />
            <span>~</span>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
            />
          </div>
        </div>

        {/* 안내문 */}
        <div className="order-inquiry-info">
          <p>
            기본적으로 최근 3개월간의 자료가 조회되며, 기간 검색시 주문처리완료
            후 36개월 이내의 주문내역을 조회하실 수 있습니다.
          </p>
          <p>
            완료 후 36개월 이상 경과한 주문은 <span>과거주문내역</span>에서
            확인할 수 있습니다.
          </p>
          <p>
            주문번호를 클릭하시면 해당 주문에 대한 상세내역을 확인하실 수
            있습니다.
          </p>
        </div>
      </div>

      {/* 테이블 */}
      {orderActive === "orderHistory" && (
        <div className="order-inquiry-table-container">
          <h2>주문내역조회</h2>
          <table className="order-inquiry-table">
            <thead>
              <tr>
                <th>주문일자 [주문번호]</th>
                <th>상품정보</th>
                <th>수량</th>
                <th>주문금액</th>
                <th>주문상태</th>
                <th>취소/교환/반품</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="empty-orders">
                  주문 내역이 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {orderActive === "cancelHistory" && (
        <div className="order-inquiry-table-container">
          <h2>취소/반품/교환</h2>
          <table className="order-inquiry-table">
            <thead>
              <tr>
                <th>주문일자 [주문번호]</th>
                <th>상품정보</th>
                <th>수량</th>
                <th>주문금액</th>
                <th>주문상태</th>
                <th>취소/교환/반품</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="empty-orders">
                  주문 내역이 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderInquiry;
