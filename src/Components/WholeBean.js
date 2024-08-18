import NaviBar from "./NaviBar";
import "./WholeBean.css";
import CoffeeJson from "../Coffee.json";
import { useState } from "react";

function WholeBean() {
  const [wholeBean, setWholeBean] = useState(CoffeeJson);

  return (
    <div className="WholeBean">
      <NaviBar />
      <h1 className="WholeBean-title">- WholeBean -</h1>
      <div className="WholeBean-container">
        {wholeBean.map((image) => (
          <div className="WholeBean-area" key={image.id}>
            <img className="WholeBean-img" src={image.img} alt={image.title} />
            <p>title</p>
            <p>price</p>
            <p>description</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WholeBean;
