import React from 'react';
import YouTube from 'react-youtube';
import { nanoid } from 'nanoid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { useSwiperSlide } from 'swiper/react';

import Image from './Image';

import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';

export default function SeriesSlide() {
  let active = 0;
  const [link, setLink] = React.useState('');
  const [fightClub, setFightClub] = React.useState({});
  const [noCFOM, setNoCFOM] = React.useState({});
  const [darkKnight, setDarkKnight] = React.useState({});
  const [movieIndex, setMovieIndex] = React.useState(0);
  const [trailerActive, setTrailerActive] = React.useState(false);

  React.useEffect(() => {
    async function getSeries(id) {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${
          import.meta.env.VITE_API_KEY
        }&language=en-US&append_to_response=videos`
      );
      const data = await res.json();

      if (id == 550) {
        setFightClub(data);
      }
      if (id == 264660) {
        setNoCFOM(data);
      }
      if (id == 155) {
        setDarkKnight(data);
      }
    }
    getSeries(550);
    getSeries(264660);
    getSeries(155);
  }, []);

  function playTrailer(index) {
    let trailerLink;
    if (index === 0) {
      trailerLink = fightClub.videos.results.find(
        (item) => item.type == 'Trailer'
      ).key;
    }
    if (index === 1) {
      trailerLink = noCFOM.videos.results.find(
        (item) => item.type == 'Trailer'
      ).key;
    }
    if (index === 2) {
      trailerLink = darkKnight.videos.results.find(
        (item) => item.type == 'Trailer'
      ).key;
    }
    setTrailerActive(true);
    setLink(trailerLink);
  }

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        loop={true}
        grabCursor={true}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        onSlideChange={(index) => setMovieIndex(index.realIndex)}
      >
        <SwiperSlide>
          <Image
            img={
              fightClub.backdrop_path &&
              `https://image.tmdb.org/t/p/original${fightClub.backdrop_path}`
            }
            name={fightClub.title}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            img={
              noCFOM.backdrop_path &&
              `https://image.tmdb.org/t/p/original${noCFOM.backdrop_path}`
            }
            name={noCFOM.title}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            img={
              darkKnight.backdrop_path &&
              `https://image.tmdb.org/t/p/original${darkKnight.backdrop_path}`
            }
            name={darkKnight.title}
          />
        </SwiperSlide>

        <div className="btn-box">
          <span className="btn-gray">
            <button className="btn-gray-watchlist">
              <ion-icon name="add-outline" class="btn-gray-watchlist-icon" />
              <p>Watchlist</p>
            </button>
          </span>
          <span className="btn-blue">
            <button
              className="btn-blue-watchnow"
              onClick={() => playTrailer(movieIndex)}
            >
              Watch Trailer
            </button>
          </span>
        </div>
      </Swiper>
      {trailerActive && (
        <div className="yt-bg">
          <div className="youtube-wrapper">
            <div className="close-video">
              <p>Play Trailer</p>
              <ion-icon
                name="close-outline"
                class="icon-close"
                onClick={() => setTrailerActive(false)}
              ></ion-icon>
            </div>
            <YouTube
              videoId={link}
              className={'youtube'}
              opts={{
                height: '563',
                width: '1000',
                playerVars: {
                  autoplay: 1,
                  controls: 1,
                  cc_load_policy: 0,
                  fs: 1,
                  iv_load_policy: 3,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                },
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
