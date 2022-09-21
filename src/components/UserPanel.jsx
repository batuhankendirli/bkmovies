import React from 'react';
import Modal from './Modal';

import { Context } from '../Context';

export default function UserPanel() {
  const [title, setTitle] = React.useState('');
  const modalRef = React.useRef(null);
  const { user } = React.useContext(Context);

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

  return (
    <>
      <Modal title={title} ref={modalRef} handleClick={handleSwitch}></Modal>
      <div className="user-panel">
        {user ? (
          user.email
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
