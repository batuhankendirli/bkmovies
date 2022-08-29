import React from 'react';
import { nanoid } from 'nanoid';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/lazy';
import 'swiper/css/scrollbar';
import 'swiper/css/mousewheel';
import 'swiper/css/free-mode';

import { Lazy, FreeMode, Mousewheel, Scrollbar } from 'swiper';

export default function ShowSlide(props) {
  const slide = props.data.map((item) => {
    return (
      <SwiperSlide key={nanoid()} className="movie-slide">
        {item}
      </SwiperSlide>
    );
  });
  return (
    <Swiper
      scrollbar={{
        hide: true,
        draggable: true,
      }}
      modules={[Lazy, FreeMode, Mousewheel, Scrollbar]}
      lazy={true}
      slidesPerView={'auto'}
      freeMode={true}
      className="series-wrapper"
      spaceBetween={30}
      grabCursor={true}
      touchEventsTarget={'container'}
    >
      {slide}
    </Swiper>
  );
}
