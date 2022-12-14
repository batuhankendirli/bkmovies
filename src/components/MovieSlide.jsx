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
  const [fightClub, setFightClub] = React.useState({});
  const [exMachina, setExMachina] = React.useState({});
  const [darkKnight, setDarkKnight] = React.useState({});
  const [movieIndex, setMovieIndex] = React.useState(0);
  const [trailerActive, setTrailerActive] = React.useState(false);
  const [movieId, setMovieId] = React.useState(550);
  const { user, watchLater } = React.useContext(Context);

  React.useEffect(() => {
    async function getSeries(id) {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&language=en-US&append_to_response=videos`
      );
      const data = await res.json();

      if (id == 550) {
        setFightClub(data);
      }
      if (id == 264660) {
        setExMachina(data);
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
      trailerLink = exMachina.videos.results.find(
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

  const handleWatchLater = async (type) => {
    if (user) {
      if (user.emailVerified) {
        if (watchLater.some((movie) => movie.id === movieId)) {
          const movie = watchLater.find((movie) => movie.id === movieId);
          await removeMovie(movie);
        } else {
          async function getMovie(movieId) {
            const res = await fetch(
              `https://api.themoviedb.org/3/movie/${movieId}?api_key=${
                import.meta.env.VITE_TMDB_API_KEY
              }&language=en-US&append_to_response=videos`
            );
            const data = await res.json();

            await addMovie(data, type);
          }
          getMovie(movieId);
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
          setMovieIndex(index.realIndex);
          if (index.realIndex === 0) {
            setMovieId(550);
          } else if (index.realIndex === 1) {
            setMovieId(264660);
          } else if (index.realIndex === 2) {
            setMovieId(155);
          }
        }}
      >
        <SwiperSlide>
          <Image
            img={
              fightClub.backdrop_path &&
              `https://image.tmdb.org/t/p/w1280${fightClub.backdrop_path}`
            }
            name={fightClub.title}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            img={
              exMachina.backdrop_path &&
              `https://image.tmdb.org/t/p/w1280${exMachina.backdrop_path}`
            }
            name={exMachina.title}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            img={
              darkKnight.backdrop_path &&
              `https://image.tmdb.org/t/p/w1280${darkKnight.backdrop_path}`
            }
            name={darkKnight.title}
          />
        </SwiperSlide>

        <div className="btn-box">
          <span className="btn-gray">
            <button
              className="btn-gray-watchlist"
              onClick={() => handleWatchLater('movie')}
            >
              <ion-icon
                name={`${
                  watchLater.some((movie) => movie.id === movieId)
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
