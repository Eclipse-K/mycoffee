import NaviBar from "./NaviBar";

function DripBag() {
  return (
    <div className="DripBag">
      <NaviBar />
      <h1>DripBag</h1>
      <div className="DripBag-container">
        <div>img</div>
        <p>title</p>
        <p>price</p>
        <p>description</p>
      </div>
    </div>
  );
}

export default DripBag;
