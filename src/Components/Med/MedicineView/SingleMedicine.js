import React, { useState, useEffect } from "react";

import Loading from "./../../Static/Loading";
import MedicineFullDescription from "./MedicineFullDescription";

import { GrLocation } from 'react-icons/gr'
import { MdDateRange } from "react-icons/md";
import { BiShow } from "react-icons/bi"

function SingleMedicine({ medData, medImages }) {
  const [imagesUrl, setImagesUrl] = useState(null);
  const [toggleFullDescription, setToggleFullDescription] = useState(false);

  const imagesfromBufferToImage = () => {
    let arrayBufferView, blob, src;

    const bufferedImageUrl = [];
    for (let i = 0; i < medImages.length; i++) {
      arrayBufferView = new Uint8Array(medImages[i].pic.data)
      blob = new Blob([arrayBufferView], { type: 'image/png' });
      src = URL.createObjectURL(blob);

      bufferedImageUrl.push(src);
    }

    setImagesUrl(bufferedImageUrl)
  }

  useEffect(() => {
    imagesfromBufferToImage();

  }, [])

  //    console.log({medData})
  if (imagesUrl === null)
    return <Loading />
  else
    return (
      <div className="flex flex-col">
        <div className="bg-white rounded-3xl p-4 transition duration-500 hover:shadow-xl border-1 border-gray-300 hover:border-indigo-700">
          <div className="flex-none lg:flex">
            <div className="h-full w-full lg:h-48 lg:w-48 lg:mb-0 mb-3">
              <img src={imagesUrl[0]} alt="Just a flower" className="w-full  object-scale-down lg:object-cover  lg:h-48 rounded-2xl" />
            </div>
            <div className="flex-auto ml-4 trancate justify-evenly py-2">
              <div className="flex flex-wrap align-start justify-start text-start">
                <div className="w-full flex-none text-xs text-blue-700 font-medium ">
                  mfr: {medData.mfr}
                </div>
                <h2 className="flex-auto text-lg font-medium truncate">{medData.name.substring(0, 35)}{(medData.name.length > 35) ? "..." : ""}</h2>
              </div>
              <div className="flex py-4 items-center text-sm text-gray-600">
                <div className="flex-1 inline-flex items-center">
                  <GrLocation className="" />
                  <span>{medData.country_of_origin}</span>
                </div>
                <div className="flex-1 inline-flex items-center">
                  <MdDateRange />
                  <span>{medData.date_added.split("T")[0]}</span>
                </div>
              </div>
              <div className="flex p-2 border-t border-gray-200 "></div>
              <div className="flex-auto flex space-x-3 justify-center">
                <button data-toggle="modal" data-target="#fullDescModal" onClick={() => setToggleFullDescription(true)} className="border-gray-300 mb-2 md:mb-0 bg-white px-5 py-2 hover:shadow-lg tracking-wider border-1 text-gray-600 rounded-full inline-flex items-center space-x-2 transition duration-500">
                  <span className="text-green-400 hover:text-green-500 rounded-lg">
                    <BiShow className="text-2xl" />
                  </span>
                  <span>Show full product</span>
                </button>
                {/* Modal */}

                {toggleFullDescription &&
                  <div className="modal fade" id="fullDescModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-keyboard="false" data-backdrop="static">
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                      <div className="modal-content bg-white rounded-xl">
                        <div className="modal-header">
                          <h5 className="modal-title text-indigo-700" id="exampleModalLabel">{medData.name}</h5>
                          <button type="button" className="close cursor-pointer" onClick={() => setToggleFullDescription(false)} data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <MedicineFullDescription medData={medData} medImages={imagesUrl} />
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary cursor-pointer" onClick={() => setToggleFullDescription(false)} data-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>}
                {/* Modal ends*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  //        return (
  //        <div className="w-48 h-66 p-2 m-2 flex flex-col overflow-hidden space-y-1 border-2 border-green-300 rounded-lg hover:bg-lime-200 cursor-pointer transition duration-500 ease-in-out transform hover:scale-110">
  //            <img src={imagesUrl[0]} alt="med0" className="rounded-lg transition transform hover:scale-110 duration-500 ease-in-out"/>
  //            <div className="flex flex-col mt-2">
  //              <span className="truncate font-bold text-sm">{medData.name}</span>
  //              <span className="text-purple-800 font-bold mt-1">₹{medData.price}</span>
  //              <span className="text-xs text-start truncate text-gray-500 font-bold">mfr: {medData.mfr}</span>
  //            </div>
  //        </div>
  //        )
}
export default SingleMedicine
