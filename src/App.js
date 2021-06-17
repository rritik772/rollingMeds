import React, {useState} from 'react'

import logo from './logo.svg';
import './App.css';

import NavBar from './Components/Static/NavBar'
import Loading from './Components/Static/Loading';

function App() {
  return (
    <div className="App">
      <NavBar/>
      {/*<Loading/>*/}
    </div>
  );
}

export default App;
