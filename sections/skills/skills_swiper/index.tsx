import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/bundle";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import { Autoplay } from "swiper";
import { SkillsSwiperContainer, Slide } from "./styles";
import { ReactElement } from "react";
import { isMobile } from "react-device-detect";

interface ISkillsSwiperProps {
  items: Array<ReactElement>;
  reversed?: boolean;
}

export const SkillsSwiper = ({ items, reversed = false }: ISkillsSwiperProps) => {
  return (
    <SkillsSwiperContainer>
      <Swiper
        speed={3000}
        slidesPerView={isMobile ? 3 : 5}
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
        {items.map((item) => (
          <SwiperSlide>
            <Slide>{item}</Slide>
          </SwiperSlide>
        ))}
      </Swiper>
    </SkillsSwiperContainer>
  );
};
