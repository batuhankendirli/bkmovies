import React from 'react';
import YouTube from 'react-youtube';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';

import Image from './Image';
import { Context } from '../Context';
import { addMovie, removeMovie } from '../firebase';

import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import { toast } from 'react-toastify';

export default function SeriesSlide() {
  const [link, setLink] = React.useState('');
  const [breakingBad, setBreakingBad] = React.useState({});
  const [chernobyl, setChernobyl] = React.useState({});
  const [rickAndMorty, setRickAndMorty] = React.useState({});
  const [serieIndex, setSerieIndex] = React.useState(0);
  const [serieId, setSerieId] = React.useState(550);
  const { user, watchLater } = React.useContext(Context);

  const [trailerActive, setTrailerActive] = React.useState(false);

  React.useEffect(() => {
    async function getSeries(id) {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
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

  const handleWatchLater = async (type) => {
    if (user) {
      if (user.emailVerified) {
        if (watchLater.some((serie) => serie.id === serieId)) {
          const serie = watchLater.find((serie) => serie.id === serieId);
          await removeMovie(serie);
        } else {
          async function getSerie(serieId) {
            const res = await fetch(
              `https://api.themoviedb.org/3/tv/${serieId}?api_key=${
                import.meta.env.VITE_TMDB_API_KEY
              }&language=en-US&append_to_response=videos`
            );
            const data = await res.json();

            await addMovie(data, type);
          }
          getSerie(serieId);
        }
      } else {
        toast.error('Please verify your email to continue.', {
          autoClose: 5000,
          toastId: 'verify',
        });
      }
    } else {
      toast.error('Hold it right there! You should log in first.', {
        autoClose: 5000,
        toastId: 'login',
      });
    }
  };

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
        onSlideChange={(index) => {
          setSerieIndex(index.realIndex);
          if (index.realIndex === 0) {
            setSerieId(1396);
          } else if (index.realIndex === 1) {
            setSerieId(87108);
          } else if (index.realIndex === 2) {
            setSerieId(60625);
          }
        }}
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
            <button
              className="btn-gray-watchlist"
              onClick={() => handleWatchLater(serieIndex, 'tv')}
            >
              <ion-icon
                name={`${
                  watchLater.some((serie) => serie.id === serieId)
                    ? 'checkmark-outline'
                    : 'add-outline'
                }`}
                class="btn-gray-watchlist-icon"
              />
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
