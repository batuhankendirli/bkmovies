import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';

import { onAuthStateChanged } from 'firebase/auth';
import {
  onSnapshot,
  doc,
  query,
  collection,
  orderBy,
} from 'firebase/firestore';
const Context = React.createContext();

function ContextProvider({ children }) {
  const [clickedSearch, setClickedSearch] = useState('');
  const [currentLink, setCurrentLink] = useState('');
  const [user, setUser] = useState(auth.currentUser);

  const [watchLater, setWatchLater] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    if (user) {
      const q = query(
        collection(db, auth.currentUser.uid),
        orderBy('createdAt')
      );
      const unsub = onSnapshot(q, (querySnapshot) => {
        let moviesArr = [];
        querySnapshot.forEach((doc) => {
          moviesArr.push({ ...doc.data() });
        });
        setWatchLater(moviesArr);
      });

      return () => {
        unsubscribe();
        unsub();
      };
    }
  }, [user]);

  return (
    <Context.Provider
      value={{
        clickedSearch,
        setClickedSearch,
        currentLink,
        setCurrentLink,
        user,
        setUser,
        watchLater,
        setWatchLater,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };
