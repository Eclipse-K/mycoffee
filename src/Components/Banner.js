import "./Banner.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

function Banner() {
  return (
    <div className="Banner">
      <div className="Banner-container">
        <button>
          <SlArrowLeft />
        </button>
        <h1>배너영역</h1>
        <button>
          <SlArrowRight />
        </button>
      </div>
    </div> //이동
  );
}

export default Banner;
