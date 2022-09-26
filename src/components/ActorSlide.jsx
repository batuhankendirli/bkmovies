import React from 'react';
import { nanoid } from 'nanoid';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/lazy';
import 'swiper/css/scrollbar';
import 'swiper/css/mousewheel';
import 'swiper/css/free-mode';

import { Lazy, FreeMode, Mousewheel, Scrollbar } from 'swiper';

export default function ActorSlide(props) {
  const slide = props.data.map((item) => {
    return (
      <SwiperSlide key={nanoid()} className="actor-slide">
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
      grabCursor={true}
      touchEventsTarget={'container'}
    >
      {slide}
    </Swiper>
  );
}
