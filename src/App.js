import React, { useEffect, useState } from 'react'
import './App.css';

import NavBar from './Components/Static/NavBar'
import { LOCALHOST } from "./Constant";
import Loading from "./Components/Static/Loading";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStoredUser = async () => {
      const data = localStorage.getItem('user');

      if (data !== null) {
        setLoading(true);
        const response = await fetch(`${LOCALHOST}get-user/${data}`);
        const userData = await response.json();

        console.log(userData)
        if (userData !== null) setUser(userData);
      }

    }

    getStoredUser();
    console.log(user)
    setLoading(false);
  }, [])

  return (
    <div className="App">
      {(loading) ? <Loading /> :
        <NavBar loggedInUser={user} />}
    </div>
  );
}

export default App;
