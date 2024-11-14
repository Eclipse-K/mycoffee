import "./BestItem.css";
import CoffeeJson from "../Coffee.json";
import { useState } from "react";
import { useEffect } from "react";

function BestItem() {
  const [bestItem, setBestItem] = useState([]);

  useEffect(() => {
    const combinedItems = [
      ...CoffeeJson.WholeBean,
      ...CoffeeJson.DripBag,
      ...CoffeeJson.HandDrip,
      ...CoffeeJson.Products,
    ];

    const sortedBestItem = combinedItems
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
    setBestItem(sortedBestItem);
  }, []);

  return (
    <div className="BestItem">
      <div className="BestItem-container">
        <h1>BEST ITEM</h1>
        <div className="BestItem-box">
          <div className="BestItem-area">
            {bestItem.map((best) => (
              <div className="Item-area" key={best.id}>
                <img
                  className="Item-area-img"
                  src={best.img}
                  alt={best.title}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestItem;
