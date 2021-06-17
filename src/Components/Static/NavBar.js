import React, { useState, useEffect } from 'react'

import "./../../style/main.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from '../../App';
import Home from '../Med/Home';
import Login from './Login';
import SignUp from './SignUp';

import { RiProfileLine } from "react-icons/ri";
import { GiHamburgerMenu } from 'react-icons/gi';
import MainProfile from '../Profile/MainProfile';
import AddMedicine from '../Profile/AddMedicine';
import MedicineView from '../Med/MedicineView/MedicineView';


function NavBar() {
  const [user, setUser] = useState(null);

  const pageSetter = (e) => {
    console.log(e)
    if (e === "<Login/>")
      setNowPage(<Login onClick={(e) => pageSetter(e)} onChange={(e) => setUser(e)} />);
    else if (e === "<SignUp/>")
      setNowPage(<SignUp onClick={(e) => pageSetter(e)} />);
    else if (e === "<Home/>") {
      setNowPage(<Home user={user} onClick={(e) => pageSetter(e)} />)
    }else if(e === "<Medicine/>"){
      setNowPage(<MedicineView onClick={(e) => pageSetter(e)} user={user}/>);
    }else if(e === "<MainProfile/>"){
      setNowPage(<MainProfile onClick={(e) => pageSetter(e)} user={user} />)
    }else if (e === "<Logout/>"){
      setUser(null);
      setNowPage(<Home user={null} onClick={(e) => pageSetter(e)}/>)
    }
  }
  const [nowPage, setNowPage] = useState(<Home user={user} onClick={(e) => pageSetter(e)}/>);

  return (
    <div>
      <nav className="navbar sticky-top navbar-expand-lg bg-white px-3 py-2">
        <button className="no-underline cursor-pointer py-1 px-5 font-semibold rounded-full hover:shadow-lg border-2 border-gray-300 hover:border-black mx-3 transition duration-500 ease-in-out" onClick={() => (setNowPage(<Home user={user}  onClick={(e) => pageSetter(e)} />))}>RollingMEDs</button>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className=""><GiHamburgerMenu /></span>
        </button>
        <div className="collapse navbar-collapse flex justify-between items-start" id="navbarNavDropdown">
          <ul className="nav nav-pills nav-justified">
            <button className="mt-2 cursor-pointer no-underline py-1 px-4 font-semibold rounded-full hover:shadow-lg border-1 border-gray-200 hover:border-indigo-700 mx-3 transition duration-500 ease-in-out transform " onClick={() => (setNowPage(<Home user={user} onClick={(e) => pageSetter(e)}  />))}>Home</button>
            {!user && <button className="mt-2 cursor-pointer no-underline py-1 px-4 font-semibold rounded-full hover:shadow-lg border-1 border-gray-200 hover:border-indigo-700 mx-3 transition duration-500 ease-in-out transform " onClick={() => (setNowPage(<Login onClick={(e) => pageSetter(e)} onChange={(e) => setUser(e)} />))}>Login</button>}
            {!user && <button className="mt-2 cursor-pointer no-underline py-1 px-4 font-semibold rounded-full hover:shadow-lg border-1 border-gray-200 hover:border-indigo-700 mx-3 transition duration-500 ease-in-out transform " onClick={() => (setNowPage(<SignUp onClick={(e) => pageSetter(e)} />))}>Sign Up</button>}
            {user && <button className="mt-2 cursor-pointer no-underline py-1 px-4 font-semibold rounded-full hover:shadow-lg border-1 border-gray-200 hover:border-indigo-700 mx-3 transition duration-500 ease-in-out transform " onClick={() => { setNowPage(<Home user={null} onClick={(e) => pageSetter(e)} />); setUser(null) }}>Logout</button>}
          </ul>
          <ul className="nav nav-pills nav-justified">
            {user && <button className="mt-2 cursor-pointer no-underline py-1 px-4 font-semibold rounded-full hover:shadow-xl border-1 border-gray-200 hover:border-indigo-700 mx-3 transition duration-500 ease-in-out transform " onClick={() => (setNowPage(<MedicineView onClick={(e) => pageSetter(e)} user={user} />))}>Medicine</button>}
            {user && <button className="mt-2 cursor-pointer no-underline py-1 px-4 font-semibold rounded-full hover:shadow-xl border-1 border-gray-200 hover:border-indigo-700 mx-3 transition duration-500 ease-in-out transform " onClick={() => (setNowPage(<MainProfile onClick={(e) => pageSetter(e)} user={user} />))}><RiProfileLine className="inline-block text-xl" /> {user.full_name}</button>}
          </ul>
        </div>
      </nav>
      {nowPage && nowPage}
    </div>
  )
}

export default NavBar
