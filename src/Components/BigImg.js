import "./BigImg.css";
import CoffeeJson from "../Coffee.json";
import { useState } from "react";
import { useEffect } from "react";

function BigImg() {
  const [bigImg1, setBigImg1] = useState(null);
  const [bigImg2, setBigImg2] = useState(null);

  useEffect(() => {
    //1,2
    const extractImg1 = [
      ...CoffeeJson.WholeBean.map((imgitem) => imgitem.img),
      ...CoffeeJson.DripBag.map((imgitem) => imgitem.img),
    ];
    const randomImg1 = Math.floor(Math.random() * extractImg1.length);
    setBigImg1(extractImg1[randomImg1]);

    //3,4
    const extractImg2 = [
      ...CoffeeJson.HandDrip.map((imgitem) => imgitem.img),
      ...CoffeeJson.Products.map((imgitem) => imgitem.img),
    ];
    const randomImg2 = Math.floor(Math.random() * extractImg2.length);
    setBigImg2(extractImg2[randomImg2]);
  }, []);

  return (
    <div className="BigImg">
      <div className="BigImg-container">
        <div className="BigImg-1">
          {bigImg1 ? <img src={bigImg1} alt="Random" /> : <p>Loading...</p>}
        </div>
        <div className="BigImg-1">
          {bigImg2 ? <img src={bigImg2} alt="Random" /> : <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
}

export default BigImg;
