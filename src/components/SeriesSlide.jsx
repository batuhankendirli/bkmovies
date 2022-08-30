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
  const [link, setLink] = React.useState('');
  const [breakingBad, setBreakingBad] = React.useState({});
  const [chernobyl, setChernobyl] = React.useState({});
  const [rickAndMorty, setRickAndMorty] = React.useState({});
  const [serieIndex, setSerieIndex] = React.useState(0);

  const [trailerActive, setTrailerActive] = React.useState(false);

  React.useEffect(() => {
    async function getSeries(id) {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${
          import.meta.env.VITE_API_KEY
        }&language=en-US&append_to_response=videos`
      );
      const data = await res.json();

      if (id == 1396) {
        setBreakingBad(data);
      }
      if (id == 87108) {
        setChernobyl(data);
      }
      if (id == 60625) {
        setRickAndMorty(data);
      }
    }
    getSeries(1396);
    getSeries(87108);
    getSeries(60625);
  }, []);

  // let serieIndex = 0;
  function playTrailer(index) {
    let trailerLink;
    if (index === 0) {
      trailerLink = breakingBad.videos.results.find(
        (item) => item.type == 'Trailer'
      ).key;
    }
    if (index === 1) {
      trailerLink = chernobyl.videos.results.find(
        (item) => item.type == 'Trailer'
      ).key;
    }
    if (index === 2) {
      trailerLink = rickAndMorty.videos.results.find(
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
        onSlideChange={(index) => setSerieIndex(index.realIndex)}
      >
        <SwiperSlide>
          <Image
            img={
              breakingBad.backdrop_path &&
              `https://image.tmdb.org/t/p/w1280${breakingBad.backdrop_path}`
            }
            name={breakingBad.name}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            img={
              chernobyl.backdrop_path &&
              `https://image.tmdb.org/t/p/w1280${chernobyl.backdrop_path}`
            }
            name={chernobyl.name}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            img={
              rickAndMorty.backdrop_path &&
              `https://image.tmdb.org/t/p/w1280${rickAndMorty.backdrop_path}`
            }
            name={rickAndMorty.name}
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
              onClick={() => playTrailer(serieIndex)}
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
