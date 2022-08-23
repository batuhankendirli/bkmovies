import React from 'react';
import { genres } from '../genreData';

export default function MovieCard(props) {
  const genresText = [];
  const propsLength =
    props.genres.length == 1 ? props.genres.length : props.genres.length - 1;
  for (let i = 0; i < propsLength; i++) {
    for (let j = 0; j < genres.length; j++) {
      if (props.genres[i] === genres[j].id) {
        genresText.push(genres[j].name);
      }
    }
  }
  return (
    <div className="card">
      <img src={props.image} alt={props.fullTitle} className="card-img" />
      <div className="card-wrapper">
        <h2 className="card-name">{props.title}</h2>

        <div>
          <div className="card-texts">
            <p className="card-texts-rate">{props.rate}</p>
            <p className="card-texts-type">{genresText.join(', ')}</p>
          </div>
          <div className="card-buttons">
            <button
              className="btn-gray-watchlist btn-watchlist-sm"
              onClick={props.addWatchLater}
            >
              <ion-icon name="add-outline" class="btn-gray-watchlist-icon" />
            </button>
            <a
              href="#"
              target="_blank"
              className="btn-blue-watchnow btn-watchnow-sm"
            >
              Watch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
