import NaviBar from "./NaviBar";

function WholeBean() {
  return (
    <div className="WholeBean">
      <NaviBar />
      <h1>WholeBean</h1>
      <div className="WholeBean-container">
        <div>img</div>
        <p>title</p>
        <p>price</p>
        <p>description</p>
      </div>
    </div>
  );
}

export default WholeBean;
