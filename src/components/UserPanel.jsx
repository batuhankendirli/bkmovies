import React from 'react';
import Modal from './Modal';

import { Context } from '../Context';
import { logOut, addMovie, removeMovie } from '../firebase';
import PanelCard from './PanelCard';
import { nanoid } from 'nanoid';
import ShowSlide from './ShowSlide';
import YouTube from 'react-youtube';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import SettingsModal from './SettingsModal';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

export default function UserPanel() {
  const [title, setTitle] = React.useState('');
  const modalRef = React.useRef(null);
  const settingsRef = React.useRef(null);
  const { user, watchLater, setWatchLater, panelActive, setPanelActive } =
    React.useContext(Context);
  const [topMovies, setTopMovies] = React.useState([]);
  const [topTV, setTopTV] = React.useState([]);
  const [trailerActive, setTrailerActive] = React.useState(false);
  const [youtubePlayer, setYoutubePlayer] = React.useState('');
  const [animationParent] = useAutoAnimate();
  const [firstTen, setFirstTen] = React.useState([]);
  const [noTrailer, setNoTrailer] = React.useState(false);
  const noTrailerRef = React.useRef(null);
  const backdropRef = React.useRef(null);

  React.useEffect(() => {
    async function getTopRatedMovies() {
      const res = await fetch(
        `
        https://api.themoviedb.org/3/movie/top_rated?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&language=en-US&page=1`
      );
      const data = await res.json();
      setTopMovies(data.results.slice(0, 10));
    }
    getTopRatedMovies();

    async function getTopRatedTV() {
      const res = await fetch(
        `
        https://api.themoviedb.org/3/tv/top_rated?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&language=en-US&page=1`
      );
      const data = await res.json();
      setTopTV(data.results.slice(0, 10));
    }
    getTopRatedTV();
  }, []);

  const handleLogin = () => {
    setTitle('Log in');
    modalRef.current.open();
  };
  const handleSignup = () => {
    setTitle('Sign up');
    modalRef.current.open();
  };

  const handleSwitch = () => {
    title === 'Log in' ? setTitle('Sign up') : setTitle('Log in');
  };

  const handleLogout = async () => {
    setWatchLater([]);
    await logOut();
  };

  const handleSettings = () => {
    settingsRef.current.openSettings();
  };

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
  const handleWatchLater = async (item, type) => {
    if (user) {
      if (user.emailVerified) {
        if (watchLater.some((movie) => movie.id === item.id)) {
          const movie = watchLater.find((movie) => movie.id === item.id);
          await removeMovie(movie);
        } else {
          await addMovie(item, type);
        }
      } else {
        toast.error('Please verify your email to continue.', {
          autoClose: 5000,
          toastId: 'verify',
        });
      }
    } else {
      toast.error('Hold it right there! You should log in first.', {
        autoClose: 5000,
        toastId: 'login',
      });
    }
  };

  const mappedWatchLater = watchLater.map((item) => {
    return (
      <PanelCard
        image={
          item.poster_path
            ? `https://image.tmdb.org/t/p/w200${item.backdrop_path}`
            : '/img/no_img.jpg'
        }
        title={item.title || item.name}
        genres={''}
        rate={item.vote_average}
        key={nanoid()}
        watchTrailer={() => watchTrailer(item.id, item.name ? 'tv' : 'movie')}
        addWatchLater={() => handleWatchLater(item, item.name ? 'tv' : 'movie')}
        type={item.name ? 'tv' : 'movie'}
        id={item.id}
        item={item}
        icon={watchLater.some((movie) => movie.id === item.id)}
      />
    );
  });

  React.useEffect(() => {
    if (watchLater.length > 10) {
      setFirstTen(mappedWatchLater.slice(0, 10));
    } else {
      setFirstTen(mappedWatchLater);
    }
  }, [watchLater]);

  const handleImgError = (e) => {
    e.target.src = '/img/person.png';
  };

  React.useEffect(() => {
    const closePopup = (e) => {
      if (e.composedPath().includes(noTrailerRef.current)) {
        setNoTrailer(false);
      }
    };

    document.body.addEventListener('click', closePopup);
    return () => document.body.removeEventListener('click', closePopup);
  }, []);

  React.useEffect(() => {
    const close = (e) => {
      if (e.composedPath().includes(backdropRef.current)) {
        setPanelActive(false);
        document.body.classList.remove('blur');
      }
    };

    document.body.addEventListener('click', close);
    document.body.addEventListener('touchstart', close);
    return () => {
      document.body.removeEventListener('click', close);
      document.body.removeEventListener('touchstart', close);
    };
  }, []);

  return (
    <>
      {noTrailer && (
        <>
          <div className="modal-backdrop" ref={noTrailerRef}></div>
          <div className="trailer-content">
            <h1 className="trailer-content-text">
              There was no trailer found.
            </h1>
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
      <SettingsModal ref={settingsRef} />
      <Modal title={title} ref={modalRef} handleClick={handleSwitch}></Modal>
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

      <div
        className={`user-panel-backdrop ${
          panelActive && 'user-panel-backdrop-active'
        }`}
        ref={backdropRef}
      ></div>

      <div className={`user-panel ${panelActive && 'user-panel-active'}`}>
        {user ? (
          <div className="user-panel-wrapper">
            <div className="user-panel-top">
              <button
                className="user-panel-top-button"
                onClick={handleSettings}
              >
                <ion-icon
                  name="settings-outline"
                  class="user-panel-top-button-icon"
                ></ion-icon>
              </button>
              <div className="user-panel-info">
                {user?.displayName && (
                  <p className="user-panel-top-name">
                    {user.displayName || ''}
                  </p>
                )}
                <img
                  src={user.photoURL || '/img/person.png'}
                  alt={`${user.displayName}'s profile photo.`}
                  className="user-panel-top-img"
                  onError={(e) => handleImgError(e)}
                />
              </div>
            </div>
            <ul className="user-panel-lists">
              <li
                className="user-panel-lists-item"
                onClick={() => {
                  setPanelActive(false);
                  document.body.classList.remove('blur');
                }}
              >
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
              <li
                className="user-panel-lists-item"
                onClick={() => {
                  setPanelActive(false);
                  document.body.classList.remove('blur');
                }}
              >
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
            <div className="user-panel-list" ref={animationParent}>
              {watchLater.length > 0 && <h1>Your Watchlist</h1>}
              <div className="user-panel-list-cards">
                {watchLater.length ? (
                  <ShowSlide
                    data={firstTen}
                    panelTop={true}
                    button={watchLater.length > 10 ? true : false}
                    spaceBetween={true}
                  />
                ) : (
                  <div className="user-panel-empty">
                    <p>¯\_(ツ)_/¯</p>
                    <p style={{ textAlign: 'center' }}>
                      Add some movies or tv shows to your watchlist.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="user-panel-list">
              <h1>Top Rated Movies</h1>
              <div className="user-panel-list-cards">
                <ShowSlide
                  data={topMovies.map((item) => {
                    return (
                      <PanelCard
                        image={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w200${item.backdrop_path}`
                            : '/img/no_img.jpg'
                        }
                        title={item.title}
                        genres={item.genre_ids}
                        rate={item.vote_average}
                        key={nanoid()}
                        watchTrailer={() => watchTrailer(item.id, 'movie')}
                        addWatchLater={() => handleWatchLater(item, 'movie')}
                        type={'movie'}
                        id={item.id}
                        item={item}
                        icon={watchLater.some((movie) => movie.id === item.id)}
                      />
                    );
                  })}
                  spaceBetween={15}
                  panelTop={true}
                />
              </div>
            </div>
            {/* HELLO WORLD */}
            <div className="user-panel-list">
              <h1>Top Rated TV Series</h1>
              <div className="user-panel-list-cards">
                <ShowSlide
                  data={topTV.map((item) => {
                    return (
                      <PanelCard
                        image={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w200${item.backdrop_path}`
                            : '/img/no_img.jpg'
                        }
                        title={item.name}
                        genres={item.genre_ids}
                        rate={item.vote_average}
                        key={nanoid()}
                        watchTrailer={() => watchTrailer(item.id, 'tv')}
                        addWatchLater={() => handleWatchLater(item, 'tv')}
                        type={'tv'}
                        id={item.id}
                        item={item}
                        icon={watchLater.some((movie) => movie.id === item.id)}
                      />
                    );
                  })}
                  spaceBetween={15}
                  panelTop={true}
                />
              </div>
            </div>
            <button
              className="user-panel-logout"
              onClick={() => {
                handleLogout();
                setPanelActive(false);
                document.body.classList.remove('blur');
              }}
            >
              Log out{' '}
              <ion-icon
                name="log-out-outline"
                class="user-panel-logout-icon"
              ></ion-icon>
            </button>
          </div>
        ) : (
          <div className="user-panel-buttons">
            <button className="user-panel-buttons-signin" onClick={handleLogin}>
              Log in
            </button>
            <button
              className="user-panel-buttons-signup"
              onClick={handleSignup}
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </>
  );
}
