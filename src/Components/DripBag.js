import NaviBar from "./NaviBar";
import "./DripBag.css";

function DripBag() {
  return (
    <div className="DripBag">
      <NaviBar />
      <h1 className="DripBag-title">- DripBag -</h1>
      <div className="DripBag-container">
        <div className="DripBag-area">
          <div>img</div>
          <p>title</p>
          <p>price</p>
          <p>description</p>
        </div>
      </div>
    </div>
  );
}

export default DripBag;
