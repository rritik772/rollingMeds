import React, { useEffect, useState } from 'react';
import { LOCALHOST } from "./../../../Constant";
import { BsFillCircleFill } from 'react-icons/bs';
import { IoIosLogIn } from "react-icons/io"
import { TiUserAddOutline } from "react-icons/ti"
import { GiMedicines } from 'react-icons/gi'

export default function Header({ user }) {
  const [doctorData, setDoctorData] = useState(null);

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
              <span style={{ fontFamily: 'Recursive' }} className="text-xl lg:text-7xl ">{data.name}</span>
              <span className="text-xl lg:text-3xl">{data.type}</span>
              <span className="text-indigo-700 font-bold lg:text-2xl text-xl">{data.quote}</span>
            </div>
          </div>
        ))
      )
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 h-screen">
      <div className="container-fuild col-span-2 p-5 bg-gray-800">

      </div>
      <div className="container-fuild col-span-2 md:col-span-1 h-full bg-yellow-600 p-5">
        <div className="flex flex-col justify-center h-full items-center space-y-24">
          <div className="p-3 rounded-2xl bg-gray-800 shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110">
            <IoIosLogIn className="text-9xl text-yellow-600 text"/>
          </div>
          <div className="p-3 rounded-2xl bg-white shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110">
            <TiUserAddOutline className="text-9xl text-gray-700 text"/>
          </div>
          {user && <div className="p-3 rounded-2xl bg-gray-800 shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110">
            <GiMedicines className="text-9xl text-yellow-600 text"/>
          </div>}
        </div>
      </div>
      </div>
    </div>
  )
}
