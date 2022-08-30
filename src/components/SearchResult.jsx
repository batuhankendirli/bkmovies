import React from 'react';
import { useParams } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function SearchResult(props) {
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

  const [detailedSearch, setDetailedSearch] = React.useState([]);
  const [type, setType] = React.useState('');
  React.useEffect(() => {
    async function getResult() {
      if (props.item.media_type === 'movie' || pathMovie) {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${props.item.id || id}?api_key=${
            import.meta.env.VITE_API_KEY
          }&language=en-US`
        );
        const data = await res.json();
        setDetailedSearch(data);
        setType('movie');
      } else if (props.item.media_type === 'tv' || pathTV) {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${props.item.id || id}?api_key=${
            import.meta.env.VITE_API_KEY
          }&language=en-US`
        );
        const data = await res.json();
        setType('tv');
        setDetailedSearch(data);
      }
    }
    getResult();
  }, [props.item, id]);

  return (
    <>
      {detailedSearch.length !== 0 ? (
        <>
          {type === 'movie' && (
            <div className="searched-item" rel={animationParent}>
              <img
                src={`https://image.tmdb.org/t/p/original${detailedSearch.backdrop_path}`}
                alt={`Photo of ${detailedSearch.title}`}
                className="searched-item-img"
              />
              <div className="searched-item-box">
                <img
                  src={`https://image.tmdb.org/t/p/original${detailedSearch.poster_path}`}
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
                </div>
              </div>
            </div>
          )}
          {type === 'tv' && (
            <div className="searched-item" rel={animationParent}>
              <img
                src={`https://image.tmdb.org/t/p/original${detailedSearch.backdrop_path}`}
                alt={`Photo of ${detailedSearch.name}`}
                className="searched-item-img"
              />
              <div className="searched-item-box">
                <img
                  src={`https://image.tmdb.org/t/p/original${detailedSearch.poster_path}`}
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
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
}
