import NaviBar from "./NaviBar";
import "./Products.css";

function Products() {
  return (
    <div className="Products">
      <NaviBar />
      <h1 className="Products-title">- Products -</h1>
      <div className="Products-container">
        <div className="Products-area">
          <div>img</div>
          <p>title</p>
          <p>price</p>
          <p>description</p>
        </div>
      </div>
    </div>
  );
}

export default Products;
