import React from 'react';
import MainSlide from './MainSlide';
import MovieCard from './MovieCard';
import MovieSlide from './MovieSlide';
import { nanoid } from 'nanoid';
import YouTube from 'react-youtube';

export default function SectionMain() {
  const [popularShows, setPopularShows] = React.useState([]);
  const [popularDrama, setPopularDrama] = React.useState([]);
  const [popularCrime, setPopularCrime] = React.useState([]);
  const [popularMystery, setPopularMystery] = React.useState([]);
  const [popularComedy, setPopularComedy] = React.useState([]);
  const [trailerActive, setTrailerActive] = React.useState(false);
  const [youtubePlayer, setYoutubePlayer] = React.useState('');

  React.useEffect(() => {
    async function getGenreType(id) {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${
          import.meta.env.VITE_API_KEY
        }&language=en-US&page=1`
      );
      const data = await res.json();

      const filteredData = data.results.filter((item) =>
        item.genre_ids.includes(id)
      );
      // .sort((a, b) => b.vote_count - a.vote_count);
      const allGenreType = filteredData.slice(0, 10);
      let i = 2;
      do {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${
            import.meta.env.VITE_API_KEY
          }&language=en-US&page=${i}`
        );
        const genreData = await response.json();
        allGenreType.push(
          ...genreData.results
            .filter((item) => item.genre_ids.includes(id))
            // .sort((a, b) => b.vote_count - a.vote_count)
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
      <section className="section-main">
        <div className="search-area margin-bottom-mid">
          <ul className="search-area-list">
            <li className="search-area-list-item">
              <a href="#" className="search-area-list-item-link">
                Movies
              </a>
            </li>
            <li className="search-area-list-item">
              <a href="#" className="search-area-list-item-link">
                TV Shows
              </a>
            </li>
            <li className="search-area-list-item">
              <a href="#" className="search-area-list-item-link">
                Anime
              </a>
            </li>
          </ul>
          <div className="search-area-box">
            <ion-icon name="search-outline" class="search-area-box-icon" />
            <input
              type="search"
              name=""
              id="search"
              placeholder="Search"
              className="search-area-box-input"
            />
            <ion-icon name="funnel-outline" class="search-area-box-icon" />
          </div>
        </div>
        <MainSlide />
        <h2 className="section-main-header">Popular on BKMovies</h2>
        <MovieSlide
          data={popularShows.map((item) => {
            return (
              <MovieCard
                image={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                title={item.name}
                genres={item.genre_ids}
                rate={item.vote_average}
                key={nanoid()}
                watchTrailer={() => watchTrailer(item.id)}
              />
            );
          })}
        />
        <h2 className="section-main-header">Drama</h2>
        <MovieSlide
          data={popularDrama.map((item) => {
            return (
              <MovieCard
                image={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                title={item.name}
                genres={''}
                rate={item.vote_average}
                key={nanoid()}
                watchTrailer={() => watchTrailer(item.id)}
              />
            );
          })}
        />
        <h2 className="section-main-header">Crime</h2>
        <MovieSlide
          data={popularCrime.map((item) => {
            return (
              <MovieCard
                image={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                title={item.name}
                genres={''}
                rate={item.vote_average}
                key={nanoid()}
                watchTrailer={() => watchTrailer(item.id)}
              />
            );
          })}
        />
        <h2 className="section-main-header">Mystery</h2>
        <div className="series-wrapper">
          <MovieSlide
            data={popularMystery.map((item) => {
              return (
                <MovieCard
                  image={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                  title={item.name}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
                />
              );
            })}
          />
        </div>

        <h2 className="section-main-header">Comedy</h2>
        <div className="series-wrapper">
          <MovieSlide
            data={popularComedy.map((item) => {
              return (
                <MovieCard
                  image={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                  title={item.name}
                  genres={''}
                  rate={item.vote_average}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
                />
              );
            })}
          />
        </div>
      </section>
    </>
  );
}
