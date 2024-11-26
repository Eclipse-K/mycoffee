import "./BigImg.css";
import CoffeeJson from "../Coffee.json";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

function BigImg() {
  const [bigImg1, setBigImg1] = useState(null);
  const [bigImg2, setBigImg2] = useState(null);
  const [bigImgLoading, setBigImgLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    //1,2
    const extractImg1 = [
      ...CoffeeJson.WholeBean.map((imgitem) => ({
        img: imgitem.img,
        id: imgitem.id,
        category: "WholeBean",
      })),
      ...CoffeeJson.DripBag.map((imgitem) => ({
        img: imgitem.img,
        id: imgitem.id,
        category: "DripBag",
      })),
    ];
    const randomImg1 =
      extractImg1[Math.floor(Math.random() * extractImg1.length)];
    setBigImg1(randomImg1);

    //3,4
    const extractImg2 = [
      ...CoffeeJson.HandDrip.map((imgitem) => ({
        img: imgitem.img,
        id: imgitem.id,
        category: "HandDrip",
      })),
      ...CoffeeJson.Products.map((imgitem) => ({
        img: imgitem.img,
        id: imgitem.id,
        category: "Products",
      })),
    ];
    const randomImg2 =
      extractImg2[Math.floor(Math.random() * extractImg2.length)];
    setBigImg2(randomImg2);
  }, []);

  const bigImgClick = (category, id) => {
    window.scrollTo(0, 0);
    setBigImgLoading(true);
    setTimeout(() => {
      navigate(`/${category}/${id}`);
      setBigImgLoading(false);
    }, 1000);
  };

  return (
    <div className="BigImg">
      <div className="BigImg-container">
        {bigImgLoading ? (
          <LoadingSpinner /> // 로딩 상태일 때 스피너 표시
        ) : (
          <div className="BigImg-box">
            <div className="BigImg-1">
              {bigImg1 ? (
                <img
                  src={bigImg1.img}
                  alt="Random"
                  onClick={() => bigImgClick(bigImg1.category, bigImg1.id)} // 클릭 이벤트 핸들러
                />
              ) : (
                <LoadingSpinner />
              )}
            </div>
            <div className="BigImg-1">
              {bigImg2 ? (
                <img
                  src={bigImg2.img}
                  alt="Random"
                  onClick={() => bigImgClick(bigImg2.category, bigImg2.id)} // 클릭 이벤트 핸들러
                />
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BigImg;
