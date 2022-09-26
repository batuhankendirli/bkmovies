import React from 'react';
import { Context } from '../Context';
import MovieCard from './MovieCard';
import { addMovie, removeMovie } from '../firebase';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import WatchlistCard from './WatchlistCard';
import YouTube from 'react-youtube';

export default function Watchlist() {
  const { watchLater } = React.useContext(Context);
  const [parent] = useAutoAnimate();
  const [show, setShow] = React.useState(false);
  const [trailerActive, setTrailerActive] = React.useState(false);
  const [youtubePlayer, setYoutubePlayer] = React.useState('');

  const [noTrailer, setNoTrailer] = React.useState(false);
  const noTrailerRef = React.useRef(null);

  function displayRest() {
    setShow((prevState) => !prevState);
  }

  async function watchTrailer(id, type) {
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${
        import.meta.env.VITE_TMDB_API_KEY
      }&language=en-US`
    );
    const data = await res.json();
    const filteredYoutube = data.results.filter(
      (item) => item.site === 'YouTube'
    );

    const videoObject =
      filteredYoutube.length > 0
        ? filteredYoutube.find(
            (item) => item.name == 'Official Trailer' || item.type == 'Trailer'
          ) ||
          filteredYoutube[0] ||
          ''
        : '';

    if (videoObject) {
      setTrailerActive(true);
      setYoutubePlayer(() => {
        return (
          <YouTube
            videoId={videoObject.key}
            className={'youtube'}
            opts={{
              height: '563',
              width: '1000',
              playerVars: {
                autoplay: 1,
                controls: 1,
                cc_load_policy: 0,
                fs: 1,
                iv_load_policy: 3,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
              },
            }}
          />
        );
      });
    } else {
      setNoTrailer(true);
    }
  }

  const mappedWatchLater = watchLater.map((movie) => {
    return (
      <WatchlistCard
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : '/img/no_img.jpg'
        }
        title={movie.title || movie.name}
        rate={movie.vote_average}
        key={movie.watchLaterId}
        watchTrailer={() =>
          watchTrailer(movie.id, movie.title ? 'movie' : 'tv')
        }
        removeMovie={() => removeMovie(movie)}
        type={movie.title ? 'movie' : 'tv'}
        id={movie.id}
        item={movie}
      />
    );
  });

  const firstTweve = [];
  if (watchLater.length > 12) {
    for (let i = 0; i < 12; i++) {
      firstTweve.push(mappedWatchLater[i]);
    }
  } else if (watchLater.length > 0 && watchLater.length <= 12) {
    for (let i = 0; i < watchLater.length; i++) {
      firstTweve.push(mappedWatchLater[i]);
    }
  }

  React.useEffect(() => {
    const closePopup = (e) => {
      if (e.composedPath().includes(noTrailerRef.current)) {
        setNoTrailer(false);
      }
    };

    document.body.addEventListener('click', closePopup);
    return () => document.body.removeEventListener('click', closePopup);
  }, []);

  return (
    <>
      {noTrailer && (
        <>
          <div className="modal-backdrop" ref={noTrailerRef}></div>
          <div className="trailer-content">
            <h1 className="trailer-content-text">There was no trailer found.</h1>
            <ion-icon
              name="close-outline"
              class="trailer-content-icon-close"
              onClick={() => {
                setNoTrailer(false);
              }}
            ></ion-icon>
          </div>
        </>
      )}

      {trailerActive && (
        <div className="yt-bg">
          <div className="youtube-wrapper">
            <div className="close-video">
              <p>Play Trailer</p>
              <ion-icon
                name="close-outline"
                class="icon-close"
                onClick={() => setTrailerActive(false)}
              ></ion-icon>
            </div>
            {youtubePlayer}
          </div>
        </div>
      )}
      <div className="watchlist">
        {watchLater.length > 0 && (
          <h1 className="watchlist-title">Your Watchlist</h1>
        )}
        <div className="watchlist-wrapper" ref={parent}>
          {watchLater.length > 12 ? (
            firstTweve
          ) : watchLater.length > 0 ? (
            mappedWatchLater
          ) : (
            <div className="watchlist-empty">
              <p>¯\_(ツ)_/¯</p>
              <p style={{ textAlign: 'center' }}>
                Add some movies or tv shows to your watchlist.
              </p>
            </div>
          )}

          {show && mappedWatchLater.slice(12)}
        </div>
        {watchLater.length > 12 && (
          <button className="watchlist-btn" onClick={displayRest}>
            {show ? 'Show less' : 'Show all'}
          </button>
        )}
      </div>
    </>
  );
}
