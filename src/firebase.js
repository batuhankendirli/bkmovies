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
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
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
    toast.success('Hurrayy! Welcome to BKMovies!');
    return user;
  } catch (error) {
    toast.error(error.message);
  }
};

export const emailVerification = async () => {
  try {
    await sendEmailVerification(auth.currentUser);
    toast.success(
      `Dogrulama maili ${auth.currentUser.email} adresine gonderildi.`
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
        duration: 3000,
      }
    );
    return user;
  } catch (error) {
    toast.error(error.message);
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
    toast.success(`Reset link sent to ${email}.`, {
      duration: 3000,
    });
  } catch (error) {
    toast.error(error.message);
  }
};

export const updateUserData = async (displayName, photoURL) => {
  try {
    await updateProfile(auth.currentUser, {
      displayName: displayName,
      photoURL: photoURL,
    });
    toast.success('Profile updated!');
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
    toast.success(`${data.title || data.name} added to watch later!`, {
      duration: 2000,
      style: {
        width: '300px',
      },

      ariaProps: {
        style: {
          justifyContent: 'start',
        },
      },
    });
  } catch (error) {
    toast.error(error.message);
  }
};

export const removeMovie = async (data) => {
  try {
    await deleteDoc(doc(db, auth.currentUser.uid, data.watchLaterId));
    toast.error(`${data.title || data.name} removed from your watchlist!`, {
      duration: 2000,
      style: {
        width: '300px',
      },

      ariaProps: {
        style: {
          justifyContent: 'start',
        },
      },
    });
  } catch (error) {
    toast.error(error.message);
  }
};

export default app;
