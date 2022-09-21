import React from 'react';
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { login, register } from '../firebase';

const Modal = forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);
  const [userInput, setUsetInput] = React.useState({
    email: '',
    password: '',
  });

  useImperativeHandle(ref, () => {
    return {
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
  });

  const handleChange = (e) => {
    setUsetInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleUserAction = async (e) => {
    e.preventDefault();
    const user =
      props.title === 'Log in'
        ? await login(userInput.email, userInput.password)
        : await register(userInput.email, userInput.password);
    setUsetInput({
      email: '',
      password: '',
    });
    user && setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{
              backdropFilter: 'brightness(100%)',
            }}
            animate={{
              backdropFilter: 'brightness(25%)',
              transition: { duration: 0.2 },
            }}
            exit={{
              backdropFilter: 'brightness(100%)',
              transition: { duration: 0.2, delay: 0.4 },
            }}
            onClick={() => {
              setOpen(false);
              setUsetInput({ email: '', password: '' });
            }}
          />
          <motion.div
            className="modal-content"
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.2, delay: 0.2 },
            }}
            exit={{
              scale: 0,
              opacity: 0,
              transition: { duration: 0.2, delay: 0.2 },
            }}
          >
            <motion.form
              className="modal-content-form"
              initial={{
                x: -25,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { duration: 0.2, delay: 0.4 },
              }}
              exit={{
                x: -25,
                opacity: 0,
                transition: { duration: 0.2 },
              }}
            >
              <ion-icon
                name="close-outline"
                class="modal-close"
                onClick={() => {
                  setOpen(false);
                  setUsetInput({ email: '', password: '' });
                }}
              ></ion-icon>
              <h1 className="modal-content-form-title">{props.title}</h1>
              <div className="form-label-input">
                <label htmlFor="email" className="modal-content-form-label">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="example@example.com"
                  name="email"
                  id="email"
                  onChange={(e) => handleChange(e)}
                  className="modal-content-form-input"
                />
              </div>
              <div className="form-label-input">
                <label htmlFor="password" className="modal-content-form-label">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="*******"
                  name="password"
                  id="password"
                  onChange={(e) => handleChange(e)}
                  className="modal-content-form-input"
                />
              </div>
              {props.title == 'Log in' && (
                <button type="button" className="modal-content-form-forgot">
                  Forgot password?
                </button>
              )}
              <button
                type="submit"
                className="modal-content-form-button"
                onClick={(e) => handleUserAction(e)}
              >
                {props.title}
              </button>

              <div className="alternative-wrapper">
                <p className="modal-content-form-alternative-text">
                  {props.title === 'Log in' ? "Don't" : 'Already'} have an
                  account?
                </p>
                <button
                  type="button"
                  className="modal-content-form-alternative"
                  onClick={props.handleClick}
                >
                  {props.title === 'Log in' ? 'Sign up' : 'Log in'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default Modal;
