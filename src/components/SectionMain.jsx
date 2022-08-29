import React from 'react';
import Footer from './Footer';
import MainSeries from './MainSeries';
import MainMovies from './MainMovies';

export default function SectionMain() {
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
      {/* <MainSeries /> */}
      <MainMovies />
      <Footer />
    </section>
  );
}
