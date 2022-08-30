import React from 'react';
import Footer from './Footer';
import MainSeries from './MainSeries';
import MainMovies from './MainMovies';
import SearchResult from './SearchResult';
import { nanoid } from 'nanoid';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';

export default function SectionMain() {
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [clickedSearch, setClickedSearch] = React.useState('');
  const [animationParent] = useAutoAnimate();
  const path = window.location.pathname.includes('/tv/') ? 'tv' : 'movie';

  function searchMovie(event) {
    const { value } = event.target;
    setSearch(value);
  }

  React.useEffect(() => {
    async function getSearch() {
      if (search.length !== 0) {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${
            import.meta.env.VITE_API_KEY
          }&language=en-US&query=${search || ''}&page=1&include_adult=false`
        );
        const data = await res.json();
        const filteredData = data.results.filter(
          (result) => result.media_type !== 'person'
        );
        const slicedData =
          filteredData.length < 3 ? filteredData : filteredData.slice(0, 3);
        setSearchResults(slicedData);
      } else if (search.length === 0) {
        setSearchResults([]);
      }
    }
    getSearch();
  }, [search]);

  function searchItem(item) {
    setClickedSearch(item);
    setSearch('');
  }

  const mappedSearch = searchResults.map((item) => {
    return (
      <Link
        to={`/${item.media_type}/${item.id}`}
        className="search-item"
        onClick={() => searchItem(item)}
        key={nanoid()}
      >
        <img
          src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
          alt={item.title}
          className="search-item-img"
        />
        <div className="search-item-details">
          <h2 className="search-item-details-title">
            {item.title || item.name}
          </h2>
          <div className="search-item-details-p">
            <p className="search-item-details-p-rating">{item.vote_average}</p>
            <p className="search-item-details-p-type">
              {item.media_type[0].toUpperCase()}
              {item.media_type.slice(1)}
            </p>
          </div>
        </div>
      </Link>
    );
  });

  return (
    <section className="section-main" ref={animationParent}>
      <div className="search-area margin-bottom-mid">
        <ul className="search-area-list">
          <li className="search-area-list-item">
            <NavLink
              to={'/movies'}
              className={({ isActive }) =>
                isActive
                  ? 'search-area-list-item-link-active'
                  : 'search-area-list-item-link'
              }
            >
              Movies
            </NavLink>
          </li>
          <li className="search-area-list-item">
            <NavLink
              to={'/tv-shows'}
              className={({ isActive }) =>
                isActive
                  ? 'search-area-list-item-link-active'
                  : 'search-area-list-item-link'
              }
            >
              TV Shows
            </NavLink>
          </li>
          <li className="search-area-list-item">
            <NavLink
              to={'/people'}
              className={({ isActive }) =>
                isActive
                  ? 'search-area-list-item-link-active'
                  : 'search-area-list-item-link'
              }
            >
              Anime
            </NavLink>
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
            value={search}
            onChange={searchMovie}
            autoComplete="off"
          />
          {/* <ion-icon name="funnel-outline" class="search-area-box-icon" /> */}
          {search.length > 0 && searchResults.length > 0 && (
            <div className="search-container">{mappedSearch}</div>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/" element={<MainMovies />} />
        <Route
          path={`/${path}/:id`}
          element={<SearchResult item={clickedSearch} />}
        />
        <Route path="/movies" element={<MainMovies />} />
        <Route path="/tv-shows" element={<MainSeries />} />
        {/* <Route path="/people" element={<People />} /> */}
      </Routes>

      <Footer />
    </section>
  );
}
