import React, { useEffect, useState } from 'react'
import { LOCALHOST } from "./../../Constant";
import { BsFillCircleFill } from 'react-icons/bs';
import { IoIosLogIn } from "react-icons/io"
import { TiUserAddOutline } from "react-icons/ti"
import { GiMedicines } from 'react-icons/gi'
import medIcon from "./../../Assets/healthcare.svg"
import { AiOutlineProfile } from 'react-icons/ai';
import { RiLogoutBoxLine } from "react-icons/ri";

function Home({ user, onClick }) {
  const [doctorData, setDoctorData] = useState(null);

  console.log(user)

  useEffect(() => {
    const getDoctors = async () => {
      const response = await fetch(`${LOCALHOST}get-all-doctors`)
      const data = await response.json()

      setDoctorData(data)
    }

    getDoctors();
  }, [])

  const appendDoctorDetails = () => {
    console.log(doctorData)
    if (doctorData && doctorData.length > 0) {
      return (
        Array.from(doctorData).map((data, key) => (
          <div className={`carousel-item ${(key === 0) ? 'active' : ''}`}>
            <div className="flex flex-col space-y-3 items-center">
              <span style={{ fontFamily: 'Recursive' }} className="text-xl lg:text-7xl text-white">{data.name}</span>
              <span className="text-xl lg:text-3xl text-white">{data.type}</span>
              <span className="text-indigo-700 font-bold lg:text-2xl text-xl">{data.quote}</span>
            </div>
          </div>
        ))
      )
    }
  }

  return (
    <div>
      <div>
        <div className="grid grid-cols-2 w-full md:grid-cols-3 h-screen">
          <div className="container-fuild w-full col-span-2 p-5 bg-gray-800 space-y-12">
            <div className="flex flex-col flex-wrap mx-10">
              <div className="flex items-center space-x-10 flex-wrap">
                <img src={`${medIcon}`} className="h-16" alt="rolling meds icons" />
                <span style={{ fontFamily: 'Recursive' }} className="text-5xl text-white">RollingMeds</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img src={`${medIcon}`} className="h-72" alt="rolling meds icons" />
            </div>
            <div className="flex justify-center items-center">
              <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                <div class="carousel-inner">
                  {appendDoctorDetails()}
                </div>
              </div>
            </div>
          </div>
          <div className="container-fuild col-span-2 md:col-span-1 h-full bg-yellow-600 p-5">
            <div className="flex flex-col justify-center h-full items-center space-y-24">
              {user === null &&
               <div className="p-3 rounded-2xl bg-gray-800 shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110">
                <IoIosLogIn onClick={() => onClick("<Login/>")} className="text-9xl text-yellow-600 text" />
               </div>}
              {user&&
               <div className="p-3 rounded-2xl bg-gray-800 shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110">
                <RiLogoutBoxLine onClick={() => onClick("<Logout/>")} className="text-9xl text-yellow-600 text" />
               </div>}
              {user === null &&
               <div className="p-3 rounded-2xl bg-white shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110">
                <TiUserAddOutline onClick={() => onClick("<SignUp/>")} className="text-9xl text-gray-700 text" />
               </div>}
              {user &&
               <div className="p-3 rounded-2xl bg-white shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110">
                <AiOutlineProfile onClick={() => onClick("<MainProfile/>")} className="text-9xl text-gray-700 text" />
               </div>}

              {user && <div className="p-3 rounded-2xl bg-gray-800 shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110">
                <GiMedicines onClick={() => onClick("<Medicine/>")} className="text-9xl text-yellow-600 text" />
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
