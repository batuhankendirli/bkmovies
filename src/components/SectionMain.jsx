import React from 'react';
import MainSlide from './MainSlide';
import MovieCard from './MovieCard';

export default function SectionMain() {
  const [popularShows, setPopularShows] = React.useState([]);
  const [popularDrama, setPopularDrama] = React.useState([]);
  const [popularCrime, setPopularCrime] = React.useState([]);
  const [popularMystery, setPopularMystery] = React.useState([]);
  React.useEffect(() => {
    async function getPopularSeries() {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${
          import.meta.env.VITE_API_KEY
        }&language=en-US&page=1`
      );
      const data = await res.json();
      setPopularShows(data.results.slice(0, 3));
      const res2 = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${
          import.meta.env.VITE_API_KEY
        }&language=en-US&page=2`
      );
      const data2 = await res2.json();
      const dramas = data.results
        .filter((item) => item.genre_ids.includes(18))
        .sort((a, b) => b.vote_count - a.vote_count)
        .slice(0, 3);
      dramas.length < 3 &&
        dramas.push(
          ...data2.results
            .filter((item) => item.genre_ids.includes(18))
            .sort((a, b) => b.vote_count - a.vote_count)
            .slice(0, 3 - dramas.length)
        );
      setPopularDrama(dramas);

      const crimes = data.results
        .filter((item) => item.genre_ids.includes(80))
        .sort((a, b) => b.vote_count - a.vote_count)
        .slice(0, 3);
      crimes.length < 3 &&
        crimes.push(
          ...data2.results
            .filter((item) => item.genre_ids.includes(80))
            .sort((a, b) => b.vote_count - a.vote_count)
            .slice(0, 3 - crimes.length)
        );
      setPopularCrime(crimes);

      const mysteries = data.results
        .filter((item) => item.genre_ids.includes(9648))
        .sort((a, b) => b.vote_count - a.vote_count)
        .slice(0, 3);
      mysteries.length < 3 &&
        mysteries.push(
          ...data2.results
            .filter((item) => item.genre_ids.includes(9648))
            .sort((a, b) => b.vote_count - a.vote_count)
            .slice(0, 3 - mysteries.length)
        );
      setPopularMystery(mysteries);
    }
    getPopularSeries();
  }, []);

  return (
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
      <div className="series-wrapper">
        {popularShows.map((item) => {
          return (
            <MovieCard
              image={`https://image.tmdb.org/t/p/original${item.poster_path}`}
              title={item.name}
              genres={item.genre_ids}
              rate={item.vote_average}
            />
          );
        })}
      </div>
      <h2 className="section-main-header">Drama</h2>
      <div className="series-wrapper">
        {popularDrama.map((item) => {
          return (
            <MovieCard
              image={`https://image.tmdb.org/t/p/original${item.poster_path}`}
              title={item.name}
              genres={''}
              rate={item.vote_average}
            />
          );
        })}
      </div>
      <h2 className="section-main-header">Crime</h2>
      <div className="series-wrapper">
        {popularCrime.map((item) => {
          return (
            <MovieCard
              image={`https://image.tmdb.org/t/p/original${item.poster_path}`}
              title={item.name}
              genres={''}
              rate={item.vote_average}
            />
          );
        })}
      </div>
      <h2 className="section-main-header">Mystery</h2>

      <div className="series-wrapper">
        {popularMystery.map((item) => {
          return (
            <MovieCard
              image={`https://image.tmdb.org/t/p/original${item.poster_path}`}
              title={item.name}
              genres={''}
              rate={item.vote_average}
            />
          );
        })}
      </div>
    </section>
  );
}
