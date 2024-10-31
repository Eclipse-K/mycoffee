import { useContext, useState, useEffect } from "react";
import NaviBar from "./NaviBar";
import "./CategoryPage.css";
import CoffeeJson from "../Coffee.json";
import { CartContext } from "./CartContext";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

function CategoryPage() {
  const { category } = useParams(); // URL에서 category를 받아옴
  const [categoryPage, setCategoryPage] = useState([]); // 빈 배열로 초기화
  const { addToCart } = useContext(CartContext);
  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();

  // 카테고리와 CoffeeJson 키를 매핑하는 함수
  const getCategoryData = (category) => {
    switch (category) {
      case "WholeBean":
        return CoffeeJson.WholeBean;
      case "DripBag":
        return CoffeeJson.DripBag;
      case "HandDrip":
        return CoffeeJson.HandDrip;
      case "Products":
        return CoffeeJson.Products;
      default:
        return [];
    }
  };

  // 카테고리가 변경될 때마다 CoffeeJson에서 데이터를 불러옴
  useEffect(() => {
    const data = getCategoryData(category);
    setCategoryPage(data);
  }, [category]); // category가 변경될 때마다 실행

  const handleViewDetail = (id) => {
    setPageLoading(true); // 로딩 시작
    setTimeout(() => {
      setPageLoading(false); // 로딩 끝
      navigate(`/${category}/${id}`); // 2초 후 해당 URL로 이동
    }, 1000); // 1초 후 실행
  };

  return (
    <div className="CategoryPage">
      <NaviBar />

      {pageLoading && <LoadingSpinner />}

      <h1 className="CategoryPage-title">- {category} -</h1>

      <div className="CategoryPage-box">
        <div className="CategoryPage-container">
          {categoryPage.length === 0 ? (
            <p>카테고리에 해당하는 상품이 없습니다.</p>
          ) : (
            categoryPage.map((items) => (
              <div className="CategoryPage-area" key={items.id}>
                <div className="CategoryPage-content">
                  <img
                    className="CategoryPage-img"
                    src={items.img}
                    alt={items.title}
                  />
                  <h3>{items.title}</h3>
                  <p>가격 : {items.price}</p>
                  <div
                    className="Basket-Button"
                    onClick={() => addToCart(items)}
                  >
                    장바구니 담기
                  </div>
                  <div
                    className="Detail-Button"
                    onClick={() => handleViewDetail(items.id)}
                  >
                    상세보기
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
