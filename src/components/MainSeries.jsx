import React from 'react';

import SeriesSlide from './SeriesSlide';
import MovieCard from './MovieCard';
import ShowSlide from './ShowSlide';
import { nanoid } from 'nanoid';
import YouTube from 'react-youtube';
import { Context } from '../Context';
import { addMovie, removeMovie } from '../firebase';

export default function MainSeries() {
  const [popularShows, setPopularShows] = React.useState([]);
  const [popularDrama, setPopularDrama] = React.useState([]);
  const [popularCrime, setPopularCrime] = React.useState([]);
  const [popularMystery, setPopularMystery] = React.useState([]);
  const [popularComedy, setPopularComedy] = React.useState([]);
  const [trailerActive, setTrailerActive] = React.useState(false);
  const [youtubePlayer, setYoutubePlayer] = React.useState('');

  const { user, watchLater } = React.useContext(Context);

  React.useEffect(() => {
    async function getGenreType(id) {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&language=en-US&page=1`
      );
      const data = await res.json();

      const filteredData = data.results.filter((item) =>
        item.genre_ids.includes(id)
      );

      const allGenreType = filteredData.slice(0, 10);
      let i = 2;
      do {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=en-US&page=${i}`
        );
        const genreData = await response.json();
        allGenreType.push(
          ...genreData.results
            .filter((item) => item.genre_ids.includes(id))
            .slice(0, 10 - allGenreType.length)
        );
        i++;
      } while (allGenreType.length < 10);

      setPopularShows(data.results.slice(0, 10));

      if (id === 18) {
        setPopularDrama(allGenreType);
      }
      if (id === 80) {
        setPopularCrime(allGenreType);
      }
      if (id === 9648) {
        setPopularMystery(allGenreType);
      }
      if (id === 35) {
        setPopularComedy(allGenreType);
      }
    }
    getGenreType(80);
    getGenreType(18);
    getGenreType(9648);
    getGenreType(35);
  }, []);

  async function watchTrailer(id) {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${
        import.meta.env.VITE_TMDB_API_KEY
      }&language=en-US`
    );
    const data = await res.json();
    const videoObj =
      data.results.find(
        (item) => item.name == 'Official Trailer' || item.type == 'Trailer'
      ) ||
      data.results[0] ||
      '';

    setTrailerActive(true);
    setYoutubePlayer(() => {
      return (
        <YouTube
          videoId={videoObj.key}
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
      );
    });
  }

  function LoadingAnimation() {
    return (
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  const handleWatchLater = async (item, type) => {
    if (user) {
      if (watchLater.some((movie) => movie.id === item.id)) {
        const movie = watchLater.find((movie) => movie.id === item.id);
        await removeMovie(movie);
      } else {
        await addMovie(item, type);
      }
    } else {
      toast.error('Hold it right there! You should log in first.');
    }
  };

  return (
    <>
      {/* YOUTUBE TRAILER */}

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
            {youtubePlayer}
          </div>
        </div>
      )}

      {/* YOUTUBE TRAILER */}
      <SeriesSlide />
      <h2 className="section-main-header">Popular on BKMovies</h2>
      <div className="series-wrapper">
        {popularShows.length === 10 ? (
          <ShowSlide
            data={popularShows.map((item) => {
              return (
                <MovieCard
                  image={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                      : '/img/no_img.jpg'
                  }
                  title={item.name}
                  genres={item.genre_ids}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
                  addWatchLater={() => handleWatchLater(item, 'tv')}
                  type={'tv'}
                  id={item.id}
                  item={item}
                  icon={watchLater.some((movie) => movie.id === item.id)}
                />
              );
            })}
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>
      <h2 className="section-main-header">Drama</h2>
      <div className="series-wrapper">
        {popularDrama.length === 10 ? (
          <ShowSlide
            data={popularDrama.map((item) => {
              return (
                <MovieCard
                  image={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                      : '/img/no_img.jpg'
                  }
                  title={item.name}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
                  addWatchLater={() => handleWatchLater(item, 'tv')}
                  type={'tv'}
                  id={item.id}
                  item={item}
                  icon={watchLater.some((movie) => movie.id === item.id)}
                />
              );
            })}
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>
      <h2 className="section-main-header">Crime</h2>
      <div className="series-wrapper">
        {popularCrime.length === 10 ? (
          <ShowSlide
            data={popularCrime.map((item) => {
              return (
                <MovieCard
                  image={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                      : '/img/no_img.jpg'
                  }
                  title={item.name}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
                  addWatchLater={() => handleWatchLater(item, 'tv')}
                  type={'tv'}
                  id={item.id}
                  item={item}
                  icon={watchLater.some((movie) => movie.id === item.id)}
                />
              );
            })}
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>
      <h2 className="section-main-header">Mystery</h2>
      <div className="series-wrapper">
        {popularMystery.length === 10 ? (
          <ShowSlide
            data={popularMystery.map((item) => {
              return (
                <MovieCard
                  image={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                      : '/img/no_img.jpg'
                  }
                  title={item.name}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
                  addWatchLater={() => handleWatchLater(item, 'tv')}
                  type={'tv'}
                  id={item.id}
                  item={item}
                  icon={watchLater.some((movie) => movie.id === item.id)}
                />
              );
            })}
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>

      <h2 className="section-main-header">Comedy</h2>
      <div className="series-wrapper">
        {popularComedy.length === 10 ? (
          <ShowSlide
            data={popularComedy.map((item) => {
              return (
                <MovieCard
                  image={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                      : '/img/no_img.jpg'
                  }
                  title={item.name}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
                  addWatchLater={() => handleWatchLater(item, 'tv')}
                  type={'tv'}
                  id={item.id}
                  item={item}
                  icon={watchLater.some((movie) => movie.id === item.id)}
                />
              );
            })}
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>
    </>
  );
}
