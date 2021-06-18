import React, {useState, useEffect} from 'react';
import {sha256} from 'js-sha256';
import { LOCALHOST } from "./../../Constant";
import ChangePassword from "./../Profile/ChangePassword";

import "./../../style/main.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { FaUserCircle } from 'react-icons/fa';
import { BiCheck, BiCheckDouble } from "react-icons/bi";

function Login({onClick, onChange}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toggleForgetPassoword, setToggleForgetPassword] = useState(false);
    const [forgetEmail, setForgetUsername] = useState('')
    const [user, setUser] = useState(null);

    const [flashMessage, setFlashMessage] = useState(false);
    const [toggleForgetPasswordModel, setToggleForgetPasswordModel] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (email === "" || email.length < 5)
            setFlashMessage('email is too short');
        else if (password === "" || password.length < 4)
            setFlashMessage('password is too short');
        else{
            console.log(LOCALHOST)
            const response = await fetch(`${LOCALHOST}get-user/${email}`);
            const userData = await response.json();

            if (userData === null)
                setFlashMessage('No such user found. \u{1F631}');
            else{
                const userCurrentPassword = sha256(password);
                if (userCurrentPassword === userData.password){
                    console.log(userData);
                    setFlashMessage('Logged in Successfully');
                    onChange(userData);
                    onClick("<Home/>");
                }else if (userCurrentPassword !== userData.password){
                    setFlashMessage('Password incorrect \u{1F928}')
                    return;
                }else{
                    setFlashMessage('Something went wrong. \u{1F3F3}');
                    return;
                }
            }
        }
    }

    const checkUsername = async () => {
        const response = await fetch(`${LOCALHOST}get-user/${forgetEmail}`)
        const data = await response.json()

        if (data === undefined || data == null || data.length === 0){
            setFlashMessage("No such user exist");
            setToggleForgetPasswordModel(false)
            return;
        }else{
            setUser(data);
            setToggleForgetPasswordModel(true);
        }
    }

    return (
        <div className="container">
            {flashMessage &&
            <div role="alert">
                <div className="relative text-2xl border border-t-0 border-red-400 rounded-b bg-red-100 p-2 text-red-700">
                    <span className="mt-2">{flashMessage}</span>
                    <button className="absolute inset-y-0 right-3 text-4xl font-extrabold" onClick={() => setFlashMessage(false)}>&times;</button>
                </div>
            </div>
            }
            <div className="form-group md:w-110 w-full mx-auto bg-white m-5 p-5 rounded-xl shadow-xl space-y-3">
                <FaUserCircle className="inline-block text-6xl text-gray-500"/>
                <h1 style={{fontFamily: 'Recursive'}} className="mb-4 text-blue-500 font-bold">Login</h1>
                <form onSubmit={(e) => handleLoginSubmit(e)}>
                    <input type="email" className="focus:outline-none p-2 focus:bg-white border-1 hover:border-indigo-700 w-full rounded-lg font-medium transition duration-500 ease-in-out transform hover:shadow-lg focus:shadow-lg" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" className="mt-4 focus:outline-none p-2 focus:bg-white border-1 hover:border-indigo-700 w-full rounded-lg font-medium transition duration-500 ease-in-out transform hover:shadow-lg focus:shadow-lg" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <button onClick={() => setToggleForgetPassword(!toggleForgetPassoword)} type="button" className="bg-white py-2 px-5 rounded-full border-1 font-bold border-gray-200 hover:border-indigo-600 hover:bg-indigo-500 transition duration-500 ease-in-out transform hover:shadow-xl">Forget password?</button>
                    <button type="submit" className="bg-white py-2 px-5 rounded-full border-1 font-bold border-gray-200 hover:border-indigo-700 hover:bg-indigo-500 transition duration-500 ease-in-out transform hover:shadow-xl">Submit</button>
                  </div>
                </form>
              {toggleForgetPassoword &&
                <div className="flex mt-4 space-x-4">
                  <input value={forgetEmail} onChange={(e) => setForgetUsername(e.target.value)} type="text" className="w-full px-3 py-1 border-1 border-gray-200 hover:border-indigo-200 rounded-xl hover:shadow-lg transition duration-500 ease-in-out outline-none font-medium" placeholder="Enter email"/>
                  <span onClick={() => checkUsername()} className="p-1 border-1 border-gray-200 hover:border-indigo-700 hover:shadow-lg rounded-xl transition duration-500"><BiCheck className="text-3xl text-gray-700"/></span>
                </div>}
            </div>
          {toggleForgetPasswordModel && <ChangePassword user={user}/>}
        </div>
    )
}

export default Login
