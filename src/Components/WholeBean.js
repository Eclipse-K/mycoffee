import NaviBar from "./NaviBar";
import "./WholeBean.css";

function WholeBean() {
  return (
    <div className="WholeBean">
      <NaviBar />
      <h1 className="WholeBean-title">- WholeBean -</h1>
      <div className="WholeBean-container">
        <div className="WholeBean-area">
          <div>img</div>
          <p>title</p>
          <p>price</p>
          <p>description</p>
        </div>
      </div>
    </div>
  );
}

export default WholeBean;
