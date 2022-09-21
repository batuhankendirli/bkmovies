import React from 'react';
import { useParams } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { nanoid } from 'nanoid';
import YouTube from 'react-youtube';

import ShowSlide from './ShowSlide';
import MovieCard from './MovieCard';
import ActorCard from './ActorCard';
import ActorSlide from './ActorSlide';

export default function SearchResult(props) {
  const [trailerActive, setTrailerActive] = React.useState(false);
  const [youtubePlayer, setYoutubePlayer] = React.useState('');

  const [detailedSearch, setDetailedSearch] = React.useState([]);
  const [type, setType] = React.useState('');

  const [recommended, setRecommended] = React.useState([]);
  const [actors, setActors] = React.useState([]);

  const [animationParent] = useAutoAnimate();
  let { id } = useParams();

  const pathMovie = window.location.pathname.includes('/movie/');
  const pathTV = window.location.pathname.includes('/tv/');

  function LoadingAnimation() {
    return (
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }
  async function watchTrailer(id) {
    const res = await fetch(
      `https://api.themoviedb.org/3/${
        type === 'movie' ? 'movie' : 'tv'
      }/${id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
    );
    const data = await res.json();
    const videoObj =
      data.results.find(
        (item) => item.name == 'Official Trailer' || item.type == 'Trailer'
      ) ||
      data.results[0] ||
      '';

    setTrailerActive(true);
    setYoutubePlayer(() => {
      return (
        <YouTube
          videoId={videoObj.key}
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
  }

  React.useEffect(() => {
    async function getResult() {
      if (pathMovie) {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id || props.item.id}?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=en-US`
        );

        const data = await res.json();
        setDetailedSearch(data);
        setType('movie');

        const recRes = await fetch(
          `https://api.themoviedb.org/3/movie/${
            id || props.item.id
          }/recommendations?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=en-US&page=1`
        );
        const recData = await recRes.json();
        setRecommended(recData.results.slice(0, 10));

        // ACTOR LIST

        const resActor = await fetch(
          `https://api.themoviedb.org/3/movie/${
            id || props.item.id
          }/credits?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
        );
        const dataActor = await resActor.json();
        setActors(dataActor.cast.slice(0, 10));
      } else if (pathTV) {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id || props.item.id}?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=en-US`
        );
        const data = await res.json();
        setType('tv');
        setDetailedSearch(data);

        const recRes = await fetch(
          `https://api.themoviedb.org/3/tv/${
            id || props.item.id
          }/recommendations?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=en-US&page=1`
        );
        const recData = await recRes.json();
        setRecommended(
          recData.results.length > 10 && recData.results.length !== 0
            ? recData.results.slice(0, 10)
            : recData.results
        );

        // ACTOR LIST

        const resActor = await fetch(
          `https://api.themoviedb.org/3/tv/${
            id || props.item.id
          }/credits?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
        );
        const dataActor = await resActor.json();

        setActors(dataActor.cast.slice(0, 10));
      }
    }
    getResult();
  }, [props.item, id]);

  return (
    <>
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
      {detailedSearch.length !== 0 ? (
        <>
          {type === 'movie' && (
            <div>
              <div className="searched-item" rel={animationParent}>
                <img
                  src={
                    detailedSearch.backdrop_path
                      ? `https://image.tmdb.org/t/p/w1280${detailedSearch.backdrop_path}`
                      : '/img/background.jpg'
                  }
                  alt={`Photo of ${detailedSearch.title}`}
                  className="searched-item-img"
                />
                <div className="searched-item-box">
                  <img
                    src={
                      detailedSearch.poster_path
                        ? `https://image.tmdb.org/t/p/w342${detailedSearch.poster_path}`
                        : '/img/no_img.jpg'
                    }
                    alt={`Poster of ${detailedSearch.title}`}
                    className="searched-item-box-img"
                  />
                  <div className="searched-item-box-content">
                    <h1 className="searched-item-box-content-header">
                      {detailedSearch.title}{' '}
                      <span>({detailedSearch.release_date.slice(0, 4)})</span>
                    </h1>
                    <div className="searched-item-box-content-container">
                      <p className="searched-item-box-content-container-genre">
                        {detailedSearch.genres
                          .map((item) => item.name)
                          .join(', ')}
                      </p>
                      <p className="searched-item-box-content-container-runtime">
                        {detailedSearch.runtime > 60
                          ? `${Math.floor(detailedSearch.runtime / 60)}h ${
                              detailedSearch.runtime % 60
                            }m`
                          : `${detailedSearch.runtime}m`}
                      </p>
                    </div>
                    <p className="searched-item-box-content-rating">
                      {detailedSearch.vote_average.toFixed(1)}
                    </p>
                    <em className="searched-item-box-content-tagline">
                      {detailedSearch.tagline}
                    </em>
                    <h4 className="searched-item-box-content-overview-header">
                      Overview
                    </h4>
                    <p className="searched-item-box-content-overview-text">
                      {detailedSearch.overview}
                    </p>
                    <div className="search-buttons">
                      <button
                        className="btn-gray-watchlist btn-watchlist"
                        onClick={props.addWatchLater}
                      >
                        <ion-icon
                          name="add-outline"
                          class="btn-gray-watchlist-icon"
                        />
                        <p>Watchlist</p>
                      </button>
                      <button
                        className="btn-blue-watchnow btn-watchnow"
                        onClick={() => watchTrailer(detailedSearch.id)}
                      >
                        Watch Trailer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="section-main-header">Cast</h2>

              {actors.length > 0 ? (
                <ActorSlide
                  data={actors.map((item) => {
                    return (
                      <ActorCard
                        image={item.profile_path}
                        name={item.name}
                        character={item.character}
                      />
                    );
                  })}
                />
              ) : (
                <LoadingAnimation />
              )}
            </div>
          )}
          {type === 'tv' && (
            <div>
              <div className="searched-item" rel={animationParent}>
                <img
                  src={
                    detailedSearch.backdrop_path
                      ? `https://image.tmdb.org/t/p/w1280${detailedSearch.backdrop_path}`
                      : '/img/background.jpg'
                  }
                  alt={`Photo of ${detailedSearch.name}`}
                  className="searched-item-img"
                />
                <div className="searched-item-box">
                  <img
                    src={
                      detailedSearch.poster_path
                        ? `https://image.tmdb.org/t/p/w342${detailedSearch.poster_path}`
                        : '/img/no_img.jpg'
                    }
                    alt={`Poster of ${detailedSearch.name}`}
                    className="searched-item-box-img"
                  />
                  <div className="searched-item-box-content">
                    <h1 className="searched-item-box-content-header">
                      {detailedSearch.name}{' '}
                      <span>({detailedSearch.first_air_date.slice(0, 4)})</span>
                    </h1>
                    <div className="searched-item-box-content-container">
                      <p className="searched-item-box-content-container-genre">
                        {detailedSearch.genres
                          .map((item) => item.name)
                          .join(', ')}
                      </p>
                      <p className="searched-item-box-content-container-runtime">
                        {detailedSearch.episode_run_time > 60
                          ? `${Math.floor(
                              detailedSearch.episode_run_time / 60
                            )}h ${detailedSearch.episode_run_time % 60}m`
                          : `${detailedSearch.episode_run_time[0]}m`}
                      </p>
                    </div>
                    <p className="searched-item-box-content-rating">
                      {detailedSearch.vote_average.toFixed(1)}
                    </p>

                    <em className="searched-item-box-content-tagline">
                      {detailedSearch.tagline}
                    </em>
                    <h4 className="searched-item-box-content-overview-header">
                      Overview
                    </h4>
                    <p className="searched-item-box-content-overview-text">
                      {detailedSearch.overview}
                    </p>
                    <div className="search-buttons">
                      <button
                        className="btn-gray-watchlist btn-watchlist"
                        onClick={props.addWatchLater}
                      >
                        <ion-icon
                          name="add-outline"
                          class="btn-gray-watchlist-icon"
                        />
                        <p>Watchlist</p>
                      </button>
                      <button
                        className="btn-blue-watchnow btn-watchnow"
                        onClick={() => watchTrailer(detailedSearch.id)}
                      >
                        Watch Trailer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="section-main-header">Cast</h2>
              {actors.length > 0 ? (
                <ActorSlide
                  data={actors.map((item) => {
                    return (
                      <ActorCard
                        image={item.profile_path}
                        name={item.name}
                        character={item.character}
                      />
                    );
                  })}
                />
              ) : (
                <LoadingAnimation />
              )}
            </div>
          )}
        </>
      ) : (
        <LoadingAnimation />
      )}

      <h2 className="section-main-header">
        Recommended {type === 'movie' ? 'Movies' : 'TV Shows'}
      </h2>
      <div className="series-wrapper">
        {recommended.length <= 10 && recommended.length !== 0 ? (
          <ShowSlide
            data={recommended.map((item) => {
              return (
                <MovieCard
                  image={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                      : '/img/no_img.jpg'
                  }
                  title={item.name || item.title}
                  genres={item.genre_ids}
                  rate={item.vote_average.toFixed(1)}
                  key={nanoid()}
                  watchTrailer={() => watchTrailer(item.id)}
                  type={type}
                  id={item.id}
                  item={item}
                />
              );
            })}
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>
    </>
  );
}
