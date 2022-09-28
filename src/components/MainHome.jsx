import React from 'react';
import { NavLink } from 'react-router-dom';
export default function MainHome() {
  return (
    <>
      <div className="home">
        <img
          src="/img/welcome.png"
          alt="Scene from Fight Club"
          className="home-img"
        />
        <div className="home-wrapper">
          <div className="home-wrapper-texts">
            <h1 className="home-wrapper-texts-header">Welcome to BKMovies!</h1>
            <p className="home-wrapper-texts-paragraph">
              BKMovies lets you keep track of every movie and tv show you want
              to see. And you can watch the trailers of your favourite movies
              and tv shows.
            </p>
          </div>
        </div>
        <ul className="margin-top-big user-panel-lists">
          <li className="user-panel-lists-item">
            <NavLink
              to={'/movies'}
              className={({ isActive }) =>
                isActive
                  ? 'user-panel-lists-item-link-active'
                  : 'user-panel-lists-item-link'
              }
            >
              Movies
            </NavLink>
          </li>
          <li className="user-panel-lists-item">
            <NavLink
              to={'/tv-shows'}
              className={({ isActive }) =>
                isActive
                  ? 'user-panel-lists-item-link-active'
                  : 'user-panel-lists-item-link'
              }
            >
              TV Shows
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}
