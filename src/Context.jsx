import React, { useState, useEffect } from 'react';

const Context = React.createContext();

function ContextProvider({ children }) {
  const [clickedSearch, setClickedSearch] = useState('');
  const [currentLink, setCurrentLink] = useState('');

  return (
    <Context.Provider
      value={{
        clickedSearch,
        setClickedSearch,
        currentLink,
        setCurrentLink,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };
