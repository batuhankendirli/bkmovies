import React from 'react';
import { genres } from '../genreData';

import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { Context } from '../Context';
export default function MovieCard(props) {
  const { setClickedSearch } = React.useContext(Context);
  const genresText = [];
  const propsLength =
    props.genres.length == 1
      ? props.genres.length
      : props.genres.includes(10759) ||
        props.genres.includes(10765) ||
        props.genres.includes(10768)
      ? 1
      : 2;
  for (let i = 0; i < propsLength; i++) {
    for (let j = 0; j < genres.length; j++) {
      if (props.genres[i] === genres[j].id) {
        genresText.push(genres[j].name);
      }
    }
  }

  function handleClick(item) {
    setClickedSearch(item);

    document.documentElement.scrollTop = 0;
  }
  return (
    <div className="card">
      <img
        src={props.image ? props.image : '/img/no_img.jpg'}
        alt={`Poster of ${props.title}`}
        className="card-img"
      />
      <div className="card-wrapper">
        <h2 className="card-name">{props.title}</h2>

        <div>
          <div className="card-texts">
            <p className="card-texts-rate">{props.rate}</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                to={`/${props.type}/${props.id}`}
                className="card-texts-link"
                onClick={() => handleClick(props.item)}
              >
                Details
              </Link>
              <p className="card-texts-type">{genresText.join(', ')}</p>
            </div>
          </div>
          <div className="card-buttons">
            <button
              className="btn-gray-watchlist btn-watchlist-sm"
              onClick={props.addWatchLater}
            >
              <ion-icon name="add-outline" class="btn-gray-watchlist-icon" />
            </button>
            <button
              className="btn-blue-watchnow btn-watchnow-sm"
              onClick={props.watchTrailer}
            >
              Trailer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
