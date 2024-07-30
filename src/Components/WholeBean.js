import NaviBar from "./NaviBar";
import "./WholeBean.css";
import WholeBeanBag from "../images/WholeBean.png";

function WholeBean() {
  return (
    <div className="WholeBean">
      <NaviBar />
      <h1 className="WholeBean-title">- WholeBean -</h1>
      <div className="WholeBean-container">
        <div className="WholeBean-area">
          <img
            className="WholeBean-img"
            src={WholeBeanBag}
            alt={WholeBeanBag}
          />
          <p>title</p>
          <p>price</p>
          <p>description</p>
        </div>
      </div>
    </div>
  );
}

export default WholeBean;
