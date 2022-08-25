import React from 'react';
import { nanoid } from 'nanoid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { useSwiperSlide } from 'swiper/react';

import Image from './Image';
import { data } from '../movieData';

import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';

export default function MainSlide() {
  let active = 0;
  const [link, setLink] = React.useState('');
  const [movieName, setMovieName] = React.useState('');
  const [watchLater, setWatchLater] = React.useState([]);

  function addWatchLater() {
    setWatchLater((prevWatchLater) => {
      return [
        ...prevWatchLater,
        {
          name: movieName,
          link: link,
        },
      ];
    });
    alert(`${movieName} added to your watch later`);
  }
  function ActiveSlide(props) {
    const swiperSlide = useSwiperSlide();
    if (swiperSlide.isActive) {
      active = props.id;
    }
    React.useEffect(() => {
      setLink(data[active].link);
      setMovieName(data[active].name);
    }, [active]);
  }

  const mappedData = data.map((item, index) => {
    return (
      <SwiperSlide key={nanoid()}>
        <Image img={item.img} name={item.name} />
        <ActiveSlide id={index} />
      </SwiperSlide>
    );
  });

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        loop={true}
        grabCursor={true}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
      >
        {mappedData}
        <div className="btn-box">
          <span className="btn-gray">
            <button className="btn-gray-watchlist" onClick={addWatchLater}>
              <ion-icon name="add-outline" class="btn-gray-watchlist-icon" />
              <p>Watchlist</p>
            </button>
          </span>
          <span className="btn-blue">
            <a href={link} className="btn-blue-watchnow" target={'_blank'}>
              Watch Trailer
            </a>
          </span>
        </div>
      </Swiper>
    </>
  );
}
