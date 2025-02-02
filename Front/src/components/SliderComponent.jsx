import React from "react";
import Slider from "react-slick";

export default function SliderComponent({ news }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    draggable: false,        // 드래그 방지
    swipe: false,            // 터치 스와이프 방지
    nextArrow: <CustomNextArrow />,  // 커스텀 화살표 적용
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="news-slider">
      <Slider {...settings}>
        {news.map((newsItem) => (
          <div className="news-card-wrapper" key={newsItem.news_idx}>
            <a className="news-card" href={newsItem.news_url} target="_blank" rel="noopener noreferrer">
              <div className="news-text">
                <h5 className="news-title">{newsItem.news_title}</h5>
                <p className="news-content">{newsItem.news_content}</p>
              </div>
              <div className="news-image-wrapper">
                <img src={newsItem.news_file} alt="news" className="news-image" />
              </div>
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
}

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";  // 아이콘 추가

function CustomNextArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={`${className} custom-arrow custom-next-arrow`} onClick={onClick}>
      <FiChevronRight size={24} />
    </div>
  );
}

function CustomPrevArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={`${className} custom-arrow custom-prev-arrow`} onClick={onClick}>
      <FiChevronLeft size={24} />
    </div>
  );
}

