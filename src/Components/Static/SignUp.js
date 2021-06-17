import React, {useState, useEffect} from 'react'
import {sha256} from 'js-sha256';

import "./../../style/main.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { LOCALHOST } from "./../../Constant";

import { FaUserPlus } from 'react-icons/fa';

function SignUp({onClick}) {

    const [doctorsTypeList, setDoctorsTypeList] = useState(null);
    const [doctorNameList, setDoctorNameList] = useState(null);
    const [clickedDoctorType, setClickedDoctorType] = useState(null);
    const [clickedDoctorName, setClickedDoctorName] = useState(null);
    const [flashMessage,setFlashMessage] = useState(false);

    const [fullName, setFullName] = useState("");
    const [passphrase, setPassphrase] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [dateBirth, setDateBirth] = useState("");

    useEffect(() => {

        const getDoctorTypeList = async () => {
            const response = await fetch(`${LOCALHOST}get-doctor-type-list`);
            const data = await response.json();

            setDoctorsTypeList(data);
        }

        getDoctorTypeList();
    }, [doctorsTypeList])

    const appendDoctorTypeList = () => {
        if (doctorsTypeList !== null && doctorsTypeList.length > 0) {
                return(
                    <>
                        {Array.from(doctorsTypeList).map((doctor, index) => {
                            return(
                                <button className="dropdown-item" key={index} onClick={(e) => {
                                    e.preventDefault();
                                    setClickedDoctorType(doctor.type)
                                }}>{doctor.type}</button>
                            )
                        })}
                    </>
                )
            }
    }

    const appendDoctorNameList = () => {
        if (doctorNameList !== null && doctorNameList.length > 0) {
            return (
                <>
                {
                    Array.from(doctorNameList).map((doctor, key) => {
                        return(
                            <button className="dropdown-item" key={key} onClick={(e) => {
                                e.preventDefault();
                                setClickedDoctorName(doctor.name);
                            }}>{doctor.name}</button>
                        )
                    })
                }
                </>
            )
        }else{
            return(
                <>
                {
                    <button class="dropdown-item">Select Doctors Type</button>
                }
                </>
            )
        }
    }

    useEffect(() => {

        const getDoctorNameList = async () => {
            const response = await fetch(`${LOCALHOST}get-doctor-name-list/${clickedDoctorType}`)
            const data = await response.json();

            setDoctorNameList(data);
        }

        getDoctorNameList();
    }, [clickedDoctorType])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (fullName.length <= 5)
            setFlashMessage("Full name must be at least 5 characters.");
        else if (passphrase.length <= 7)
            setFlashMessage("Passphrase must be at least 8 characters.");
        else if (email.length <= 5)
            setFlashMessage("Email must be at least 5 characters.");
        else if (dateBirth === null)
            setFlashMessage("Select date of birth.");
        else if (password1.length <= 5)
            setFlashMessage("Password must be at least 5 characters.");
        else if (password1 !== password2)
            setFlashMessage("Password and confirm password must be same.")
        else if (password1 === email)
            setFlashMessage("Password and email must be different.")
        else{
            const user = await fetch(`${LOCALHOST}get-user/${email}`)
            const userData = await user.json()
            if (userData !== null){
                console.log(userData)
                setFlashMessage("User Exists")
                return;
            }

            const formData = new FormData();

            formData.append("full_name", fullName);
            formData.append("passphrase", sha256(passphrase));
            formData.append("email", email);
            formData.append("password", sha256(password1));
            formData.append("date_birth", dateBirth);
            formData.append("doctor_name",clickedDoctorName);
            formData.append("doctor_type", clickedDoctorType);

            const response = await fetch(`${LOCALHOST}add-user`, {
                method: 'POST',
                body: formData
            })

            const responseData = await response.json();
            if (responseData === "OK"){
                setFlashMessage("User Created");
                onClick("<Login/>")
            }
            else
                setFlashMessage("An error has occurred!");
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
            <div className="form-group md:w-3/4 bg-white w-full mx-auto m-5 p-5 rounded-xl shadow-xl space-y-3">
                <FaUserPlus className="text-7xl inline-block text-gray-400"/>
                <h1 style={{fontFamily: 'Recursive'}} className="mb-4 text-blue-500 font-bold">Sign Up</h1>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="flex">
                        <input type="text" class="mr-3 focus:outline-none p-2 ring-2 focus:ring-4 ring-gray-500 focus:ring-indigo-500 focus:bg-white ring-opacity-40 w-full rounded-lg font-medium transition duration-500 ease-in-out transform hover:shadow-lg foucs:shadow-lg focus:scale-110" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                        <input type="text" class="ml-3 focus:outline-none p-2 ring-2 focus:ring-4 ring-gray-500 focus:ring-indigo-500 focus:bg-white ring-opacity-40 w-full rounded-lg font-medium transition duration-500 ease-in-out transform hover:shadow-lg foucs:shadow-lg focus:scale-110" placeholder="Enter Passphrase" value={passphrase} onChange={(e) => setPassphrase(e.target.value)}/>
                    </div>
                    <div className="flex mt-4">
                        <input type="email" class="mr-3 focus:outline-none p-2 ring-2 focus:ring-4 ring-gray-500 focus:ring-indigo-500 focus:bg-white ring-opacity-40 w-full rounded-lg font-medium transition duration-500 ease-in-out transform hover:shadow-lg foucs:shadow-lg focus:scale-110" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" class="ml-3 focus:outline-none p-2 ring-2 focus:ring-4 ring-gray-500 focus:ring-indigo-500 focus:bg-white ring-opacity-40 w-full rounded-lg font-medium transition duration-500 ease-in-out transform hover:shadow-lg foucs:shadow-lg focus:scale-110" placeholder="Enter Password" value={password1} onChange={(e) => setPassword1(e.target.value)}/>
                    </div>
                    <div className="flex mt-4">
                        <div className="mr-3 items-center flex w-full focus:outline-none p-2 ring-2 focus:ring-4 ring-gray-500 focus:ring-indigo-500 focus:bg-white ring-opacity-40 rounded-lg font-medium transition duration-500 ease-in-out transform hover:shadow-lg foucs:shadow-lg focus:scale-110">
                            <span className="w-2/4 text-gray-400 text-left">Date of Birth</span>
                            <input type="date" className="focus:outline-none" placeholder="Enter date of birth" onChange={(e) => setDateBirth(e.target.value)} value={dateBirth}/>
                        </div>
                        <input type="password" class="ml-3 focus:outline-none p-2 ring-2 focus:ring-4 ring-gray-500 focus:ring-indigo-500 focus:bg-white ring-opacity-40 w-full rounded-lg font-medium transition duration-500 ease-in-out transform hover:shadow-lg foucs:shadow-lg focus:scale-110" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                    </div>
                    <div className="flex mt-4 flex-column flex-md-row">
                            <div class="dropdown mr-4 w-full">
                                <button class="bg-green-400 truncate w-full focus:outline-none p-2 rounded-lg font-bold hover:border-indigo-500 hover:bg-blue-500 hover:text-white transition duration-500 ease-in-out transform hover:shadow-lg foucs:shadow-lg hover:shadow-xl shadow-md" id="dropdownTypeReference" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {(clickedDoctorType)?clickedDoctorType:"Doctor Type"}
                                </button>
                                <div class="dropdown-menu transition duration-500 ease-in-out max-h-60 overflow-y-auto" aria-labelledby="dropdownTypeReference">
                                {appendDoctorTypeList()}
                                </div>
                            </div>
                            <div class="dropdown ml-4 w-full">
                                <button class="bg-green-400 truncate w-full focus:outline-none p-2 rounded-lg font-bold hover:border-indigo-500 hover:bg-blue-500 hover:text-white transition duration-500 ease-in-out transform hover:shadow-lg foucs:shadow-lg hover:shadow-xl shadow-md" id="dropdownNameReference" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {(clickedDoctorName)?clickedDoctorName:"Doctor Name"}
                                </button>
                                <div class="dropdown-menu transition duration-500 ease-in-out max-h-60 overflow-y-auto" aria-labelledby="dropdownNameReference">
                                {appendDoctorNameList()}
                                </div>
                            </div>
                        </div>
                    <button type="submit" class="bg-green-400 mt-4 py-2 px-5 rounded-full border-4 border-blue-500 font-bold hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition duration-500 ease-in-out transform hover:shadow-lg foucs:shadow-lg hover:shadow-xl shadow-md">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp
