import "./Banner.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

function Banner() {
  return (
    <div className="Banner">
      <h1>배너영역</h1>
      <div className="Banner-container">
        <button>
          <SlArrowLeft />
        </button>
        <div></div>
        <button>
          <SlArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Banner;
