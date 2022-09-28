import React from 'react';
import { genres } from '../genreData';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { Context } from '../Context';

export default function PanelCard(props) {
  const { setClickedSearch, setPanelActive } = React.useContext(Context);

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
    <div className="panel-card">
      <img
        src={props.image ? props.image : '/img/no_img.jpg'}
        alt={`Poster of ${props.title}`}
        className="panel-card-img"
      />
      <div className="panel-card-wrapper">
        <h2 className="panel-card-name">{props.title}</h2>

        <div>
          <div className="panel-card-texts">
            <p className="panel-card-texts-rate">{props.rate.toFixed(1)}</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                to={`/${props.type}/${props.id}`}
                className="panel-card-texts-link"
                onClick={() => {
                  handleClick(props.item);
                  setPanelActive(false);
                  document.body.classList.remove('blur');
                }}
              >
                Details
              </Link>
              <p className="panel-card-texts-type">{genresText.join(', ')}</p>
            </div>
          </div>
          <div className="panel-card-buttons">
            <button
              className="panel-card-btn btn-gray-watchlist btn-watchlist-sm"
              onClick={props.addWatchLater}
            >
              <ion-icon
                name={props.icon ? 'checkmark-outline' : 'add-outline'}
                class="panel-card-btn-icon btn-gray-watchlist-icon"
              />
            </button>
            <button
              className="panel-card-btn btn-blue-watchnow btn-watchnow-sm"
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
