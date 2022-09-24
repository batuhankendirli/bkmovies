import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();

export const register = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    toast.success('Hurrayy! Welcome to BKMovies!', { autoClose: 7500 });
    return user;
  } catch (error) {
    if (error.code === 'auth/invalid-email') {
      toast.error('The provided value for the email is invalid.', {
        toastId: 'invalid-email',
      });
    } else if (error.code === 'auth/weak-password') {
      toast.error('The password must be 6 characters long or more.', {
        autoClose: 7500,
        toastId: 'weak-password',
      });
    } else if (error.code === 'auth/email-already-in-use') {
      toast.error('The email address is already in use by another account.', {
        autoClose: 7500,
        toastId: 'already-in-use',
      });
    } else {
      toast.error(error.message);
    }
  }
};

export const emailVerification = async () => {
  try {
    await sendEmailVerification(auth.currentUser);
    toast.success(
      `A verification link has been sent to ${auth.currentUser.email}.`,
      {
        autoClose: 10000,
      }
    );
  } catch (error) {
    toast.error(error.message);
  }
};

export const login = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    toast.success(
      `Welcome back${
        auth.currentUser.displayName == null
          ? ''
          : ` ${auth.currentUser.displayName}`
      }!`,
      {
        autoClose: 5000,
      }
    );
    return user;
  } catch (error) {
    if (error.code === 'auth/invalid-email') {
      toast.error('The provided value for the email is invalid.', {
        toastId: 'invalid-email',
      });
    } else if (
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      toast.error('Incorrect email or password.', {
        autoClose: 5000,
        toastId: 'incorrect',
      });
    } else {
      toast.error(error.message);
    }
  }
};

export const logOut = async () => {
  try {
    toast.success(`${auth.currentUser.email} signed out.`);
    await signOut(auth);
  } catch (error) {
    toast.error(`${error.message}`);
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success(`A password reset link has been sent to ${email}.`, {
      autoClose: 10000,
    });
  } catch (error) {
    if (
      error.code === 'auth/missing-email' ||
      error.code === 'auth/invalid-email'
    ) {
      toast.error('The provided value for the email is invalid.', {
        toastId: 'invalid-email',
      });
    } else if (error.code === 'auth/user-not-found') {
      toast.error(
        'There is no user record corresponding to this email. The user may have been deleted.',
        {
          autoClose: 7500,
          toastId: 'not-found',
        }
      );
    } else {
      toast.error(error.message);
    }
  }
};

export const updateUserData = async (
  displayName,
  photoURL = '',
  notFound = false
) => {
  try {
    await updateProfile(auth.currentUser, {
      displayName: displayName,
      photoURL: photoURL,
    });
    notFound
      ? toast.error('There was no photo found.', {
          autoClose: 7500,
        })
      : toast.success('Profile updated!');
  } catch (error) {
    toast.error(error.message);
  }
};

export const addMovie = async (data, type) => {
  try {
    const watchLaterId = nanoid();
    await setDoc(doc(db, `${auth.currentUser.uid}/${watchLaterId}`), {
      ...data,
      createdAt: new Date(),
      watchLaterId: watchLaterId,
      type: type,
    });
    toast.success(`Added to watchlist.`);
  } catch (error) {
    toast.error(error.message);
  }
};

export const removeMovie = async (data) => {
  try {
    await deleteDoc(doc(db, auth.currentUser.uid, data.watchLaterId));
    toast.error(`Removed from watchlist.`);
  } catch (error) {
    toast.error(error.message);
  }
};

export default app;
