import React from 'react';
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  auth,
  emailVerification,
  login,
  register,
  updateUserData,
} from '../firebase';
import { Context } from '../Context';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updatePassword } from 'firebase/auth';
import Modal from './Modal';

const SettingsModal = forwardRef((props, ref) => {
  const { user, setUser, changedData, setChangedData } =
    React.useContext(Context);
  const [open, setOpen] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const modalRef = React.useRef(null);

  useImperativeHandle(ref, () => {
    return {
      openSettings: () => setOpen(true),
      closeSettings: () => setOpen(false),
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChangedData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  const handleSave = async () => {
    if (user.emailVerified) {
      await updateUserData(changedData.displayName, changedData.photoURL);
      setUser(user);
      setChangedData({
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      });
    } else {
      toast.error('You should first confirm your email address.');
    }
  };

  const handleVerify = async () => {
    await emailVerification();
  };
  const updateUserPassword = async (newPassword) => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      toast.success('Password updated!');
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        toast('You should enter your current password.');
        setShowPasswordReset(true);
      } else {
        toast.error(error.message);
      }
    }
  };
  const handlePasswordChange = async (password) => {
    // await updateUserData(newPassword);
    // setNewPassword('');
    setOpen(false);
    modalRef.current.open();
  };

  return (
    <>
      <Modal ref={modalRef} />
      <AnimatePresence>
        {open && (
          <>
            <div
              className="modal-backdrop"
              onClick={() => {
                setOpen(false);
                setChangedData({
                  displayName: user.displayName || '',
                  photoURL: user.photoURL || '',
                });
              }}
            ></div>
            <div className="modal-content">
              <form className="modal-content-form">
                <div className="modal-content-top">
                  <h1 className="modal-content-form-title">Settings</h1>
                  <span>
                    <ion-icon
                      name="close-outline"
                      class="modal-content-close"
                      onClick={() => {
                        setOpen(false);
                      }}
                    ></ion-icon>
                  </span>
                </div>
                <div className="modal-content-wrapper">
                  <img
                    src={user.photoURL || '/img/person.png'}
                    alt={`${user.displayName || user.email}'s profile picture.`}
                    className="modal-content-form-image"
                  />
                  <div className="modal-content-input-wrapper">
                    <div className="form-label-input">
                      <label
                        htmlFor="name"
                        className="modal-content-form-label"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={changedData.displayName}
                        name="displayName"
                        id="name"
                        onChange={handleChange}
                        className="modal-content-form-input"
                      />
                    </div>
                    <div className="form-label-input">
                      <label
                        htmlFor="photourl"
                        className="modal-content-form-label"
                      >
                        Photo URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://pbs.twimg.com/profile_images/446356636710363136/OYIaJ1KK_400x400.png"
                        value={changedData.photoURL}
                        name="photoURL"
                        id="photourl"
                        onChange={handleChange}
                        className="modal-content-form-input"
                      />
                    </div>
                    <div className="modal-content-form-buttons">
                      <button
                        type="button"
                        className="modal-content-form-button"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      {!user.emailVerified && (
                        <button
                          type="button"
                          className="modal-content-form-button"
                          onClick={handleVerify}
                        >
                          Verify Email
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-content-bottom">
                  <div className="form-label-input">
                    <label
                      htmlFor="password"
                      className="modal-content-form-label"
                    >
                      New password
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      name="password"
                      value={newPassword}
                      id="password"
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="modal-content-form-input"
                    />
                  </div>

                  {newPassword.length === 0 && (
                    <button
                      disabled
                      type="button"
                      className="modal-content-form-button-update"
                      onClick={handlePasswordChange}
                    >
                      Update Password
                    </button>
                  )}
                  {newPassword.length > 0 && (
                    <button
                      type="button"
                      className="modal-content-form-button-update"
                      onClick={() => handlePasswordChange(newPassword)}
                    >
                      Update Password
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

export default SettingsModal;