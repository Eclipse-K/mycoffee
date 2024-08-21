import NaviBar from "./NaviBar";
import "./HandDrip.css";

function HandDrip() {
  return (
    <div className="HandDrip">
      <NaviBar />
      <h1 className="HandDrip-title">- HandDrip -</h1>
      <div className="HandDrip-container">
        <div className="HandDrip-area">
          <img className="HandDrip-img" src="" alt="" />
          <div className="HandDrip-content">
            <h3>title</h3>
            <p>price</p>
            <p>flavor_note</p>
            <p>content</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HandDrip;
