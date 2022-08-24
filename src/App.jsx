import React from 'react';
import Sidebar from './components/Sidebar';
import SectionMain from './components/SectionMain';
import UserPanel from './components/UserPanel';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <SectionMain />
      <UserPanel />
    </div>
  );
}

export default App;
