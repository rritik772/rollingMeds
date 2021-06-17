import React, { useState, useEffect } from 'react';

import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr"
import { CgPill } from 'react-icons/cg';
import { LOCALHOST } from './../../../Constant';

function MedicineFullDescription({ medData }) {
  console.log({ medData })
  const [toggleDescription, setToggleDescription] = useState(true);
  const [toggleBenefit, setToggleBenefit] = useState(false);
  const [toggleDirection, setToggleDirection] = useState(false);
  const [medImages, setMedImages] = useState('');
  const [loading, setLoading] = useState(false);

  const appendMedPicsToCarousel = () => {
    if (medImages && medImages.length > 0) {
      return (
        Array.from(medImages).map((image, key) => {
          if (key === 0)
            return (
              <div className="carousel-item active">
                <img src={medImages[0]} alt={key} className="d-block w-100 rounded-xl" />
              </div>
            )
          else
            return (
              <div className="carousel-item">
                <img src={medImages[key]} alt={key} className="rounded-xl" />
              </div>
            )
        })
      )
    } else {
      return (
        <CgPill className="animate-spin text-6xl text-blue-700" />
      )
    }
  }

  useEffect(() => {
    const getMedPics = async () => {
      setLoading(true);
      setMedImages(null);

      const response = await fetch(`${LOCALHOST}get-all-med-pics/${medData.med_id}`)
      const data = await response.json();

      console.log(data)
      let arrayBufferView, blob, src;

      const bufferedImageUrl = [];
      for (let i = 0; i < data.length; i++) {
        arrayBufferView = new Uint8Array(data[i].pic.data)
        blob = new Blob([arrayBufferView], { type: 'image/png' });
        src = URL.createObjectURL(blob);

        bufferedImageUrl.push(src);
      }

      setMedImages(bufferedImageUrl)
      setLoading(false);
    }

    getMedPics()
  }, [medData.med_id])

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex w-full lg:w-auto">
          <div id="MedicineImageCarouselControls" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
              {appendMedPicsToCarousel()}
            </div>
            <a class="carousel-control-prev" href="#MedicineImageCarouselControls" role="button" data-slide="prev">
              <span class="p-1 md:p-2 bg-white rounded-full border-1 border-gray-400 hover:shadow-xl" aria-hidden="true"><GrFormPreviousLink className="text-2xl md:text-5xl" /></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#MedicineImageCarouselControls" role="button" data-slide="next">
              <span class="p-1 md:p-2 bg-white rounded-full border-1 border-gray-400 hover:shadow-xl" aria-hidden="true"><GrFormNextLink className="text-2xl md:text-5xl" /></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col space-y-3 lg:space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="flex align-start justify-start space-x-3">
              <button className="bg-white p-1 border-1 border-gray-300 rounded-lg cursor-pointer hover:shadow-md transition duration-500">{medData.major_type}</button>
              <button className="bg-white p-1 border-1 border-gray-300 rounded-lg cursor-pointer hover:shadow-md transition duration-500">{medData.minor_type}</button>
            </div>
            <div className="flex space-x-3 items-end">
              <span className="">Price</span>
              <span className="text-2xl text-indigo-700 font-bold">₹{medData.price}</span>
            </div>
          </div>
          <div className="border-t border-gray-200" />
          <div className="grid grid-cols-2 gap-8 text-xs lg:text-base">
            <div className="flex flex-col align-items-start text-blue-800">
              <span className="font-bold">Manufactured by</span>
              <span>{medData.mfr}</span>
            </div>
            <div className="flex flex-col align-items-start text-blue-800">
              <span className="font-bold">Country of Origin</span>
              <span>{medData.country_of_origin}</span>
            </div>
          </div>
          <div className="text-start flex flex-col">
            <span className="font-bold text-gray-700 text-base lg:text-2xl">{medData.name}</span>
            <span className="text-xs lg:text-sm">{medData.major}</span>
          </div>
          <div className="grid grid-cols-2 gap-8 text-rose-500">
            <div className='flex flex-col items-start'>
              <span className="font-bold">Date added</span>
              <span>{medData.date_added.split("T")[0]}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold">quantity</span>
              <span>{medData.quantity}</span>
            </div>
          </div>
          <div className="border-t border-gray-200"></div>
          <ul className="nav nav-tabs col-span-2">
            <li className="nav-item">
              <button className={`nav-link ${(toggleDescription) ? 'active' : ""}`} onClick={() => {
                setToggleDescription(true);
                setToggleBenefit(false);
                setToggleDirection(false);
              }}>Description</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${(toggleBenefit) ? 'active' : ""}`} onClick={() => {
                setToggleDescription(false);
                setToggleBenefit(true);
                setToggleDirection(false);
              }}>Benefit</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${(toggleDirection) ? 'active' : ""}`} onClick={() => {
                setToggleDescription(false);
                setToggleBenefit(false);
                setToggleDirection(true);
              }}>Direction</button>
            </li>
          </ul>
          <div className="border-l border-r border-b border-gray-200 h-48 text-start flex mt-0 rounded-xl">
            <pre className="whitespace-pre-wrap p-2">
              {toggleDescription && medData.describes}
              {toggleBenefit && medData.benefit}
              {toggleDirection && medData.direction}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicineFullDescription;
