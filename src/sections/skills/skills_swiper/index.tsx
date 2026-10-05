import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/bundle";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import { Autoplay } from "swiper";
import { SkillsSwiperContainer, Slide } from "./styles";
import { ReactElement, useEffect, useState } from "react";
import useIsMobile from "../../../hooks/useIsMobile";

interface ISkillsSwiperProps {
  items: Array<ReactElement>;
  reversed?: boolean;
}

export const SkillsSwiper = ({ items, reversed = false }: ISkillsSwiperProps) => {
  const isMobile = useIsMobile();

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const { innerWidth, innerHeight } = typeof window !== "undefined" ? window : { innerHeight: 0, innerWidth: 0 };
    return { innerWidth, innerHeight };
  }

  return (
    <SkillsSwiperContainer>
      <Swiper
        speed={3000}
        slidesPerView={isMobile ? 3 : Math.min(Math.floor(innerWidth / 150), items.length)}
        spaceBetween={30}
        slidesPerGroup={1}
        autoplay={{
          reverseDirection: reversed,
          delay: 1000,
          disableOnInteraction: false,
        }}
        rewind={false}
        loop={true}
        pagination={false}
        navigation={false}
        modules={[Autoplay]}
      >
        {items.map((item, i) => (
          <SwiperSlide key={i}>
            <Slide>{item}</Slide>
          </SwiperSlide>
        ))}
      </Swiper>
    </SkillsSwiperContainer>
  );
};
