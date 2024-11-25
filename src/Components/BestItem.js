import "./BestItem.css";
import CoffeeJson from "../Coffee.json";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

function BestItem() {
  const [bestItem, setBestItem] = useState([]);
  const [bestItemLoading, setBestItemLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const combinedItems = [
      ...CoffeeJson.WholeBean.map((item) => ({
        ...item,
        category: "WholeBean",
      })),
      ...CoffeeJson.DripBag.map((item) => ({ ...item, category: "DripBag" })),
      ...CoffeeJson.HandDrip.map((item) => ({ ...item, category: "HandDrip" })),
      ...CoffeeJson.Products.map((item) => ({ ...item, category: "Products" })),
    ];

    const sortedBestItem = combinedItems
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    setBestItem(sortedBestItem);
  }, []);

  const bestItemClick = (category, id) => {
    window.scrollTo(0, 0);
    setBestItemLoading(true);
    setTimeout(() => {
      navigate(`/${category}/${id}`);
      setBestItemLoading(false);
    }, 1000);
  };

  return (
    <div className="BestItem">
      <div className="BestItem-container">
        <h1>BEST ITEM</h1>
        {bestItemLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="BestItem-box">
            <div className="BestItem-area">
              {bestItem.map((best) => (
                <div
                  className="Item-area"
                  key={best.id}
                  onClick={() => bestItemClick(best.category, best.id)}
                >
                  <img
                    className="Item-area-img"
                    src={best.img}
                    alt={best.title}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BestItem;
