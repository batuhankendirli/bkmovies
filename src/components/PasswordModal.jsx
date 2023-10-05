import React from 'react';
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const PasswordModal = forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState('');

  useImperativeHandle(ref, () => {
    return {
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
  });

  const reauthenticate = async (password) => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      toast.success('You can update your password now.');
      setOpen(false);
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password.', {
          autoClose: 5000,
          toastId: 'incorrect',
        });
      } else if (error.code === 'auth/too-many-requests') {
        toast.error(
          'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
          {
            autoClose: 10000,
            toastId: 'disabled',
          }
        );
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e, password) => {
    e.preventDefault();
    await reauthenticate(password);
    setPassword('');
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{
                backdropFilter: 'brightness(100%) blur(0px)',
              }}
              animate={{
                backdropFilter: 'brightness(25%) blur(10px)',
                transition: { duration: 0.2, delay: 0.4 },
              }}
              exit={{
                backdropFilter: 'brightness(100%) blur(0px)',
                transition: { duration: 0.2, delay: 0.4 },
              }}
              onClick={() => {
                setOpen(false);
              }}
            />
            <motion.div
              className="modal-password"
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 0.2, delay: 0.6 },
              }}
              exit={{
                scale: 0,
                opacity: 0,
                transition: { duration: 0.2, delay: 0.2 },
              }}>
              <motion.form
                className="modal-content-form"
                initial={{
                  y: 15,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.2, delay: 0.8 },
                }}
                exit={{
                  y: 15,
                  opacity: 0,
                  transition: { duration: 0.2 },
                }}>
                <ion-icon
                  name="close-outline"
                  class="modal-close"
                  onClick={() => setOpen(false)}></ion-icon>

                <div className="form-label-input">
                  <label
                    htmlFor="password"
                    className="modal-content-form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="*******"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => handleChange(e)}
                    className="modal-content-form-input"
                  />
                </div>

                {password.length === 0 && (
                  <button
                    disabled
                    type="submit"
                    className="modal-content-form-button"
                    onClick={(e) => handleSubmit(e, password)}>
                    Log in
                  </button>
                )}
                {password.length > 0 && (
                  <button
                    type="submit"
                    className="modal-content-form-button"
                    onClick={(e) => handleSubmit(e, password)}>
                    Log in
                  </button>
                )}
              </motion.form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

export default PasswordModal;
