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

  const [changedData, setChangedData] = React.useState({
    displayName: '',
    photoURL: '',
  });
  const [watchLater, setWatchLater] = useState([]);
  const [panelActive, setPanelActive] = React.useState(false);

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
      setChangedData({
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      });
      return () => {
        unsubscribe();
        unsub();
      };
    }
  }, [user?.displayName]);

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
        changedData,
        setChangedData,
        panelActive,
        setPanelActive,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };
