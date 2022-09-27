import React from 'react';
import { nanoid } from 'nanoid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/lazy';
import 'swiper/css/scrollbar';
import 'swiper/css/mousewheel';
import 'swiper/css/free-mode';

import { Lazy, FreeMode, Mousewheel, Scrollbar } from 'swiper';
import { Context } from '../Context';

export default function ShowSlide(props) {
  const { setPanelActive } = React.useContext(Context);
  const slide = props.data.map((item) => {
    return (
      <SwiperSlide
        key={nanoid()}
        className={`${props.spaceBetween && 'panel-slide'} movie-slide`}
      >
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
      className={`${props.panelTop && 'panel-top'} series-wrapper`}
      grabCursor={true}
      touchEventsTarget={'container'}
    >
      {
        <>
          {slide},{' '}
          {props.button == true && (
            <SwiperSlide key={nanoid()} className="button-slide">
              <Link
                to={'/watchlist'}
                className="show-rest"
                onClick={() => setPanelActive(false)}
              >
                <ion-icon
                  name="chevron-forward-outline"
                  class="show-rest-icon"
                ></ion-icon>
              </Link>
            </SwiperSlide>
          )}
        </>
      }
    </Swiper>
  );
}
