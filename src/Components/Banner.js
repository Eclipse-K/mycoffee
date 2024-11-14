import "./Banner.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Banner_1 from "../images/Banner1.png";
import Banner_2 from "../images/Banner2.png";
import Banner_3 from "../images/Banner3.png";
import Banner_4 from "../images/Banner4.png";
import { useCallback, useEffect, useState } from "react";

function Banner() {
  const BannerImg = [Banner_1, Banner_2, Banner_3, Banner_4];

  const [slideBanner, setSlideBanner] = useState(0);

  const PreviousButton = () => {
    setSlideBanner((prevIndex) =>
      prevIndex === 0 ? BannerImg.length - 1 : prevIndex - 1
    );
  };

  const NextButton = useCallback(() => {
    setSlideBanner((prevIndex) =>
      prevIndex === BannerImg.length - 1 ? 0 : prevIndex + 1
    );
  }, [BannerImg.length]);

  useEffect(() => {
    const BannerTimer = setInterval(() => {
      NextButton(); //7초마다 이동
    }, 7000);

    return () => clearInterval(BannerTimer);
  }, [NextButton]); //NextButton 의존성 배열

  return (
    <div className="Banner">
      <div className="Banner-container">
        <div className="Banner-box">
          <button className="Banner-prev" onClick={PreviousButton}>
            <SlArrowLeft />
          </button>
          <img
            className="Banner-img"
            src={BannerImg[slideBanner]}
            alt={`${slideBanner}`}
          />
          <button className="Banner-next" onClick={NextButton}>
            <SlArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
