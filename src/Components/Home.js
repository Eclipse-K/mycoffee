import NaviBar from "./NaviBar";
import Banner from "./Banner";
import BigImg from "./BigImg";
import BestItem from "./BestItem";
import "./Home.css";

function Home() {
  return (
    <div className="Home">
      <NaviBar />
      <Banner />
      <BigImg />
      <BestItem />
    </div>
  );
}

export default Home;
