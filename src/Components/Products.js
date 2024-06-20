import NaviBar from "./NaviBar";

function Products() {
  return (
    <div className="Products">
      <NaviBar />
      <h1>Products</h1>
      <div className="Products-container">
        <div>img</div>
        <p>title</p>
        <p>price</p>
        <p>description</p>
      </div>
    </div>
  );
}

export default Products;
