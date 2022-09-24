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
import toast from 'react-hot-toast';

export default function UserPanel() {
  const [title, setTitle] = React.useState('');
  const modalRef = React.useRef(null);
  const settingsRef = React.useRef(null);
  const { user, watchLater } = React.useContext(Context);
  const [topMovies, setTopMovies] = React.useState([]);
  const [topTV, setTopTV] = React.useState([]);
  const [trailerActive, setTrailerActive] = React.useState(false);
  const [youtubePlayer, setYoutubePlayer] = React.useState('');
  const [animationParent] = useAutoAnimate();
  const [firstTen, setFirstTen] = React.useState([]);

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

  const handleLogout = () => {
    logOut();
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
        toast.error('You should first verify your email.');
      }
    } else {
      toast.error('Hold it right there! You should log in first.');
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
  return (
    <>
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
      <div className="user-panel">
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
                />
              </div>
            </div>
            <div className="user-panel-list" ref={animationParent}>
              {watchLater.length > 0 && <h1>Your Watchlist</h1>}
              <div className="user-panel-list-cards">
                {watchLater.length ? (
                  <ShowSlide
                    data={firstTen}
                    spaceBetween={15}
                    panelTop={true}
                    button={watchLater.length > 10 ? true : false}
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
            <button className="user-panel-logout" onClick={handleLogout}>
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
