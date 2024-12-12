import "./Banner.css";
import Banner_1 from "../images/Banner1.png";
import Banner_2 from "../images/Banner2.png";
import Banner_3 from "../images/Banner3.png";
import Banner_4 from "../images/Banner4.png";
import OpenBanner from "../images/MyCoffee_Banner_Open.svg";
import { useEffect, useState } from "react";

function Banner() {
  const BannerImg = [OpenBanner, Banner_1, Banner_2, Banner_3, Banner_4];
  const [dotBanner, setDotBanner] = useState(0);

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDotBanner((prevIndex) =>
        prevIndex === BannerImg.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000);
    return () => clearInterval(dotTimer);
  }, [BannerImg.length]);

  const handleDotClick = (index) => {
    setDotBanner(index);
  };

  return (
    <div className="Banner">
      <div className="Banner-container">
        <div className="Banner-box">
          <img
            className="Banner-img"
            src={BannerImg[dotBanner]}
            alt={`${dotBanner + 1}`}
          />

          <div className="dots-container">
            {BannerImg.map((_, index) => (
              <button
                key={index}
                className={`dot ${dotBanner === index ? "active" : ""}`}
                onClick={() => handleDotClick(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
