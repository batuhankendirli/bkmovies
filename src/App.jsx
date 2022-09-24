import React from 'react';
import SectionMain from './components/SectionMain';
import UserPanel from './components/UserPanel';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" containerStyle={{ fontSize: '1.6rem' }} />
      <SectionMain />
      <UserPanel />
    </div>
  );
}

export default App;
