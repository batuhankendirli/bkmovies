import React from 'react';

export default function SlideButtons(props) {
  return (
    <div className="btn-box">
      <span className="btn-gray">
        <button className="btn-gray-watchlist" onClick={props.addWatchLater}>
          <ion-icon name="add-outline" class="btn-gray-watchlist-icon" />
          <p>Watchlist</p>
        </button>
      </span>
      <span className="btn-blue">
        <a href={props.link} target="_blank" className="btn-blue-watchnow">
          Watch Now
        </a>
      </span>
    </div>
  );
}
