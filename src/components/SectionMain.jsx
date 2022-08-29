import React from 'react';
import Footer from './Footer';
import MainSeries from './MainSeries';
import MainMovies from './MainMovies';
import { Routes, Route, NavLink } from 'react-router-dom';

export default function SectionMain() {
  return (
    <section className="section-main">
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
          />
          <ion-icon name="funnel-outline" class="search-area-box-icon" />
        </div>
      </div>

      <Routes>
        <Route path="/" element={<MainMovies />} />
        <Route path="/movies" element={<MainMovies />} />
        <Route path="/tv-shows" element={<MainSeries />} />
        {/* <Route path="/people" element={<People />} /> */}
      </Routes>

      <Footer />
    </section>
  );
}
