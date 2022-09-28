import React from 'react';
import Footer from './Footer';
import MainSeries from './MainSeries';
import MainMovies from './MainMovies';
import Watchlist from './Watchlist';
import SearchResult from './SearchResult';
import { nanoid } from 'nanoid';
import { Context } from '../Context';
import Logo from './Logo';
import ProtectedRoute from './ProtectedRoute';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import MainHome from './MainHome';

export default function SectionMain() {
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [showResults, setShowResults] = React.useState(false);
  const { clickedSearch, setClickedSearch, setPanelActive } =
    React.useContext(Context);
  const searchRef = React.useRef(null);

  const [animationParent] = useAutoAnimate();

  const path = window.location.pathname.includes('/tv/') ? 'tv' : 'movie';

  function searchMovie(event) {
    const { value } = event.target;
    setSearch(value);
  }

  React.useEffect(() => {
    const unfocus = (e) => {
      if (!e.composedPath().includes(searchRef.current)) {
        setShowResults(false);
      } else if (e.composedPath().includes(searchRef.current)) {
        setShowResults(true);
      }
    };

    document.body.addEventListener('click', unfocus);
    return () => document.body.removeEventListener('click', unfocus);
  }, []);

  React.useEffect(() => {
    async function getSearch() {
      if (search.length !== 0) {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=en-US&query=${search || ''}&page=1&include_adult=false`
        );
        const data = await res.json();
        const filteredData = data.results.filter(
          (result) => result.media_type !== 'person'
        );
        const slicedData =
          filteredData.length < 3 ? filteredData : filteredData.slice(0, 3);
        setSearchResults(slicedData);
        setShowResults(true);
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
          src={
            item.poster_path
              ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
              : '/img/no_img.jpg'
          }
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
          <NavLink
            to={'/'}
            className={({ isActive }) =>
              isActive ? 'navigation-logo-active' : 'navigation-logo'
            }
          >
            <Logo />
          </NavLink>
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
        </ul>
        <div className="search-area-box" ref={searchRef}>
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

          {search.length > 0 && searchResults.length > 0 && showResults && (
            <div className="search-container">{mappedSearch}</div>
          )}
        </div>
        <ion-icon
          name="person-circle-outline"
          class="search-area-user"
          onClick={() => {
            setPanelActive(true);
            document.body.classList.add('blur');
          }}
        ></ion-icon>
      </div>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route
          path={`/:${path}/:id`}
          element={<SearchResult item={clickedSearch} />}
        />

        <Route path="/movies" element={<MainMovies />} />
        <Route path="/tv-shows" element={<MainSeries />} />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </section>
  );
}
