import React, { useState, useEffect } from 'react';
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import { LOCALHOST } from "./../../Constant";
import { sha256 } from 'js-sha256';

export default function ChnageUserInfo({ user }) {
  // console.log(user)
  const [fullName, setFullName] = useState(user.full_name)
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [dateBirth, setDateBirth] = useState(user.date_birth.split("T")[0]);
  const [selectedDoctorType, setSelectedDoctorType] = useState(user.doctor_type);
  const [selectedDoctorName, setSelectedDoctorName] = useState(user.doctor_name)

  const [doctorsTypes, setDoctorsTypes] = useState(null);
  const [doctorsNames, setDoctorsNames] = useState(null);
  const [flashMessage, setFlashMessage] = useState(false);
  const [ableToChangeEmail, setAbleToChangeEmail] = useState(true);

  useEffect(() => {

    const getDoctorTypeList = async () => {
      const response = await fetch(`${LOCALHOST}get-doctor-type-list`);
      const data = await response.json();

      setDoctorsTypes(data);
    }

    getDoctorTypeList();
  }, [])

  const appendDoctorTypeList = () => {
    if (doctorsTypes !== null && doctorsTypes.length > 0) {
      return (
        <>
          {Array.from(doctorsTypes).map((doctor, index) => {
            return (
              <button className="dropdown-item" key={index} onClick={(e) => {
                e.preventDefault();
                setSelectedDoctorType(doctor.type)
                setSelectedDoctorName('Select Doctor Name')
              }}>{doctor.type}</button>
            )
          })}
        </>
      )
    }
  }

  const appendDoctorNameList = () => {
    if (doctorsNames !== null && doctorsNames.length > 0) {
      return (
        <>
          {
            Array.from(doctorsNames).map((doctor, key) => {
              return (
                <button className="dropdown-item" key={key} onClick={(e) => {
                  e.preventDefault();
                  setSelectedDoctorName(doctor.name);
                }}>{doctor.name}</button>
              )
            })
          }
        </>
      )
    } else {
      return (
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
      const response = await fetch(`${LOCALHOST}get-doctor-name-list/${selectedDoctorType}`)
      const data = await response.json();

      setDoctorsNames(data);
    }

    getDoctorNameList();
    console.log({ doctorsNames, doctorsTypes })
  }, [selectedDoctorType])

  const checkEmailCheck = async () => {
    if (email === " " || email === null || email === "" || email.length < 4) {
      setFlashMessage("Enter vaild email");
      return;
    }
    const response = await fetch(`${LOCALHOST}get-user/${email}`);
    const data = await response.json();

    if (user.email === email || data === null) {
      setAbleToChangeEmail(true)
    } else {
      setFlashMessage("This user existed with this email ")
      setAbleToChangeEmail(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fullName.length < 4) setFlashMessage("Full name length must be greater then 4.")
    else if (email.length < 4) setFlashMessage("Email length must be greater then 4.")
    else if (password.length < 4) setFlashMessage("Password length must be greater then 4.")
    else if (passphrase.length < 4) setFlashMessage("Passphrase length must be greater then 4.")
    else if (selectedDoctorName === "Select Doctor Name") setFlashMessage("Select correct doctor name")
    else if (ableToChangeEmail === false) setFlashMessage("This email has been already taken.")
    else if (sha256(passphrase) !== user.passphrase) setFlashMessage('wrong passphrase');
    else if (sha256(password) !== user.password) setFlashMessage("wrong password");
    else{
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('doctor_type', selectedDoctorType);
      formData.append('doctor_name', selectedDoctorName);
      formData.append('date_birth', dateBirth);
      formData.append("user_id", user.user_id)

      const response = await fetch(`${LOCALHOST}update-user-info`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json();

      if (data === "DONE") setFlashMessage("Changed User info successfully");
      else setFlashMessage("Something went wrong");
    }
  }

  return (
    <div className="container space-y-4 bg-white border-1 border-gray-200 rounded-xl p-4">
      {flashMessage &&
        <div className="px-4 py-1 border-1 border-rose-500 hover:shadow-xl rounded-xl flex flex-wrap justify-between items-center">
          {flashMessage}
          <button className="p-2 hover:border-rose-500 hover:shadow-lg" onClick={() => setFlashMessage(false)}>&times;</button>
        </div>}
      <h1 style={{ fontFamily: 'Recursive' }} className="text-7xl text-blue-500">Change Info</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
          <input className="w-full outline-none rounded-xl border-1 border-gray-300 hover:border-indigo-700 hover:shadow-lg focus:shadow-lg transition duration-500 ease-in-out px-3 py-2" placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input type="password" className="w-full outline-none rounded-xl border-1 border-gray-300 hover:border-indigo-700 hover:shadow-lg focus:shadow-lg transition duration-500 ease-in-out px-3 py-2" placeholder="Enter passphrase" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} />
          <div className="flex space-x-3 items-center ">
            <input input="email" className={`w-full outline-none rounded-xl border-1 ${(ableToChangeEmail) ? 'border-green-500' : 'border-gray-300'} hover:border-indigo-700 hover:shadow-lg focus:shadow-lg transition duration-500 ease-in-out px-3 py-2`} placeholder="Enter email" value={email} onChange={(e) => {
              setAbleToChangeEmail(false);
              setEmail(e.target.value)
            }} />
            <span onClick={() => checkEmailCheck()} className="cursor-pointer p-1 border-1 border-gray-300 hover:border-indigo-700 rounded-xl hover:shadow-xl transition duration-500 ease-in-out">
              {(ableToChangeEmail) ? <BiCheckDouble className="text-3xl text-green-500" /> : <BiCheck className="text-3xl" />}
            </span>
          </div>
          <input type="password" className="w-full outline-none rounded-xl border-1 border-gray-300 hover:border-indigo-700 hover:shadow-lg focus:shadow-lg transition duration-500 ease-in-out px-3 py-2" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input value={dateBirth} onChange={(e) => setDateBirth(e.target.value)} type="date" className="w-full outline-none rounded-xl border-1 border-gray-300 hover:border-indigo-700 hover:shadow-lg focus:shadow-lg transition duration-500 ease-in-out px-3 py-2" />
          <div className="flex space-x-3 items-center">
            <div className="dropdown w-full">
              <button id="drodownDoctorType" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="w-full transition duration-500 ease-in-out px-3 py-2 border-1 border-gray-300 hover:border-indigo-700 hover:shadow-lg rounded-xl">{selectedDoctorType}</button>
              <div class="dropdown-menu" aria-labelledby="drodownDoctorType">
                {appendDoctorTypeList()}
              </div>
            </div>
            <div className="dropdown w-full">
              <button id="drodownDoctorName" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="w-full transition duration-500 ease-in-out px-3 py-2 border-1 border-gray-300 hover:border-indigo-700 hover:shadow-lg rounded-xl">{selectedDoctorName}</button>
              <div class="dropdown-menu" aria-labelledby="drodownDoctorName">
                {appendDoctorNameList()}
              </div>
            </div>
          </div>
          <button type="submit" className="col-span-2 w-full transition duration-500 ease-in-out px-3 py-2 border-1 border-gray-300 hover:border-indigo-700 hover:shadow-lg rounded-xl">Submit</button>
        </div>
      </form>
    </div>
  )
}
