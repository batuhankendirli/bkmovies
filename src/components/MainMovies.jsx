import React from 'react';

import MovieSlide from './MovieSlide';
import MovieCard from './MovieCard';
import ShowSlide from './ShowSlide';
import { nanoid } from 'nanoid';
import YouTube from 'react-youtube';

export default function MainMovies() {
  const [popularMovies, setPopularMovies] = React.useState([]);
  const [popularDrama, setPopularDrama] = React.useState([]);
  const [popularThriller, setPopularThriller] = React.useState([]);
  const [popularScienceFiction, setPopularScienceFiction] = React.useState([]);
  const [popularAnimation, setPopularAnimation] = React.useState([]);
  const [popularCrime, setPopularCrime] = React.useState([]);
  const [popularMystery, setPopularMystery] = React.useState([]);

  const [trailerActive, setTrailerActive] = React.useState(false);
  const [youtubePlayer, setYoutubePlayer] = React.useState('');

  React.useEffect(() => {
    async function getGenreType(id) {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${
          import.meta.env.VITE_API_KEY
        }&language=en-US&page=1`
      );
      const data = await res.json();

      const filteredData = data.results
        .filter((item) => item.genre_ids.includes(id))
        .sort((a, b) => b.vote_count - a.vote_count);
      const allGenreType = filteredData.slice(0, 10);
      let i = 2;
      do {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${
            import.meta.env.VITE_API_KEY
          }&language=en-US&page=${i}`
        );
        const genreData = await response.json();
        allGenreType.push(
          ...genreData.results
            .filter((item) => item.genre_ids.includes(id))
            .sort((a, b) => b.vote_count - a.vote_count)
            .slice(0, 10 - allGenreType.length)
        );
        i++;
      } while (allGenreType.length < 10);

      setPopularMovies(data.results.slice(0, 10));
      if (id === 18) {
        setPopularDrama(allGenreType);
      } else if (id === 53) {
        setPopularThriller(allGenreType);
      } else if (id === 878) {
        setPopularScienceFiction(allGenreType);
      } else if (id === 16) {
        setPopularAnimation(allGenreType);
      } else if (id === 80) {
        setPopularCrime(allGenreType);
      } else if (id === 9648) {
        setPopularMystery(allGenreType);
      }
    }
    getGenreType(18);
    getGenreType(53);
    getGenreType(878);
    getGenreType(16);
    getGenreType(80);
    getGenreType(9648);
  }, []);

  async function watchTrailer(id) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${
        import.meta.env.VITE_API_KEY
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
  //

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
      <MovieSlide />
      <h2 className="section-main-header">Popular on BKMovies</h2>
      <div className="series-wrapper">
        {popularMovies.length === 10 ? (
          <ShowSlide
            data={popularMovies.map((item) => {
              return (
                <MovieCard
                  image={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  title={item.title}
                  genres={item.genre_ids}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
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
                  image={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  title={item.title}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
                />
              );
            })}
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>
      <h2 className="section-main-header">Thriller</h2>
      <div className="series-wrapper">
        {popularThriller.length === 10 ? (
          <ShowSlide
            data={popularThriller.map((item) => {
              return (
                <MovieCard
                  image={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  title={item.title}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
                />
              );
            })}
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>
      <h2 className="section-main-header">Science Fiction</h2>
      <div className="series-wrapper">
        {popularScienceFiction.length === 10 ? (
          <ShowSlide
            data={popularScienceFiction.map((item) => {
              return (
                <MovieCard
                  image={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  title={item.title}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
                />
              );
            })}
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>

      <h2 className="section-main-header">Animation</h2>
      <div className="series-wrapper">
        {popularAnimation.length === 10 ? (
          <ShowSlide
            data={popularAnimation.map((item) => {
              return (
                <MovieCard
                  image={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  title={item.title}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
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
                  image={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  title={item.title}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
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
                  image={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  title={item.title}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
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
