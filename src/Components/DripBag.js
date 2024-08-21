import NaviBar from "./NaviBar";
import "./DripBag.css";
import { useState } from "react";
import CoffeeJson from "../Coffee.json";

function DripBag() {
  // eslint-disable-next-line
  const [dripBag, setDripBag] = useState(CoffeeJson.DripBag);

  return (
    <div className="DripBag">
      <NaviBar />
      <h1 className="DripBag-title">- DripBag -</h1>
      <div className="DripBag-container">
        {dripBag.map((drip) => (
          <div className="DripBag-area" key={drip.id}>
            <img className="DripBag-img" src={drip.img} alt={drip.title} />
            <div className="DripBag-content">
              <h3>{drip.title}</h3>
              <p>{drip.price}</p>
              <p>{drip.flavor_note}</p>
              <p>{drip.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DripBag;
