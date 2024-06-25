import NaviBar from "./NaviBar";
import "./HandDrip.css";

function HandDrip() {
  return (
    <div className="HandDrip">
      <NaviBar />
      <h1 className="HandDrip-title">- HandDrip -</h1>
      <div className="HandDrip-container">
        <div className="HandDrip-area">
          <div>img</div>
          <p>title</p>
          <p>price</p>
          <p>description</p>
        </div>
      </div>
    </div>
  );
}

export default HandDrip;
