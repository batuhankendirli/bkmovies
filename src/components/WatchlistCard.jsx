import React from 'react';

import { Link } from 'react-router-dom';
import { Context } from '../Context';
export default function WatchlistCard(props) {
  const { setClickedSearch } = React.useContext(Context);

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
            <p className="card-texts-rate">{Number(props.rate).toFixed(1)}</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                to={`/${props.type}/${props.id}`}
                className="card-texts-link"
                onClick={() => handleClick(props.item)}
              >
                Details
              </Link>
            </div>
          </div>
          <div className="card-buttons">
            <button className="btn-remove" onClick={props.removeMovie}>
              <ion-icon name="trash-outline" class="btn-remove-icon" />
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
