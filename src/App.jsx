import React from 'react';
import SectionMain from './components/SectionMain';
import UserPanel from './components/UserPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Slide } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        style={{
          fontSize: '1.6rem',

          lineHeight: '1.3',
        }}
        transition={Slide}
        theme="colored"
        closeOnClick={true}
        pauseOnFocusLoss={false}
        autoClose={3000}
        toastStyle={{
          animationDuration: '.3s',
          fontFamily: 'Lato',
          fontWeight: '400',
        }}
        draggablePercent={30}
      />
      <SectionMain />
      <UserPanel />
    </div>
  );
}

export default App;
