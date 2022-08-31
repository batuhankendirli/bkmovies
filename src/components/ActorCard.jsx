import React from 'react';

export default function ActorCard(props) {
  return (
    <div className="actor">
      <img
        className="actor-img"
        src={
          props.image
            ? `https://image.tmdb.org/t/p/w200${props.image}`
            : '/img/person.png'
        }
        alt={`Photo of ${props.name}`}
      />
      <div className="actor-texts">
        <h4 className="actor-texts-name">{props.name}</h4>
        <p className="actor-texts-character">{props.character}</p>
      </div>
    </div>
  );
}
