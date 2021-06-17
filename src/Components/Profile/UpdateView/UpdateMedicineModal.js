import React, { useState, useEffect } from 'react';
import { LOCALHOST } from "./../../../Constant";
import { RiImageAddFill } from 'react-icons/ri';

export default function UpdateMedicineModal({ medData }) {
  const [medName, setMedName] = useState(medData.name);
  const [medMFR, setMedMFR] = useState(medData.mfr);
  const [medMajor, setMedMajor] = useState(medData.major);
  const [medCOO, setMedCOO] = useState(medData.country_of_origin);
  const [medDesc, setMedDesc] = useState(medData.describes);
  const [medBenefit, setMedBenefit] = useState(medData.benefit);
  const [medDirection, setMedDirection] = useState(medData.direction);
  const [medPics, setMedPics] = useState('');
  const [medPrice, setMedPrice] = useState(medData.price);
  const [medQuantity, setMedQuantity] = useState(medData.quantity);
  const [medDateAdded, setMedDateAdded] = useState(medData.date_added.split("T")[0]);
  const [toggleChangePics, setToggleChangePics] = useState(false);
  const [flashMessage, setFlashMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const [allMajorCategories, setAllMajorCategories] = useState(null);
  const [allMinorCategories, setAllMinorCategories] = useState(null);
  const [selectedMajorCategories, setSelectedMajorCategories] = useState(medData.major_type)
  const [selectedMinorCategories, setSelectedMinorCategories] = useState(medData.minor_type)
  console.log(medData.minor_type, medData.major_type, medData)

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(toggleChangePics, medPics, medPics.length, medPics.length < 1)

    if (medName.length <= 4) setFlashMessage("Medicine name must be at least 4 characters");
    else if (medMFR.length <= 4) setFlashMessage("Medicine manufacture must be at least 4 characters");
    else if (medMajor <= 4) setFlashMessage("Medicine Major must be at least 4 characters");
    else if (medCOO <= 4) setFlashMessage("Medicine country of origin must be at least 4 characters");
    else if (medDesc <= 20) setFlashMessage("Medicine description must be at least 20 characters");
    else if (medPrice === "") setFlashMessage("Medicine Price must be greater than or equal to zero.");
    else if (medQuantity === 0) setFlashMessage("Medicine Quantity must be greater than 0.");
    else {
      const formData = new FormData();

      formData.append("name", medName);
      formData.append("quantity", medQuantity);
      formData.append("major", medMajor);
      formData.append("price", medPrice);
      formData.append("describes", medDesc)
      formData.append("mfr", medMFR)
      formData.append("country_of_origin", medCOO);
      formData.append("benefit", medBenefit);
      formData.append("direction", medDirection);
      formData.append("major_type", selectedMajorCategories);
      formData.append("minor_type", selectedMinorCategories);
      formData.append("date_added", medDateAdded);
      formData.append("med_id", medData.med_id);

      let response = null
      if (!toggleChangePics) {
        response = await fetch(`${LOCALHOST}update-medicine-without-pics`, {
          method: 'POST',
          body: formData
        })
      } else {
        if (toggleChangePics && medPics.length < 1){
          setFlashMessage("At least 1 Medicine pictures **Required**");
          return;
        }
        for (let i = 0; i < medPics.length; i++) formData.append('images', medPics[i]);

        response = await fetch(`${LOCALHOST}update-medicine-with-pics`, {
          method: 'POST',
          body: formData
        })
      }

      const resp = await response.json();
      if (resp === "OK") setFlashMessage("Medicine Updated")
      else setFlashMessage("Something went wrong.")
    }
  }

  useEffect(() => {
    const getAllMajorCategories = async () => {
      const response = await fetch(`${LOCALHOST}get-all-major-medicine-category`)
      const majorCategories = await response.json();

      const newMajor = []
      for (let i = 0; i < majorCategories.length; i++) newMajor.push(majorCategories[i].major_cate)

      setAllMajorCategories(newMajor);
    }
    getAllMajorCategories();
  }, [])

  useEffect(() => {
    const getAllMinorCategories = async () => {
      const response = await fetch(`${LOCALHOST}get-all-minor-medicine-category/${selectedMajorCategories}`)
      const minorCategories = await response.json();

      const newMinor = []
      for (let i = 0; i < minorCategories.length; i++) newMinor.push(minorCategories[i].minor_cate)

      setAllMinorCategories(newMinor)
    }
    getAllMinorCategories();
  }, [selectedMajorCategories])

  const appendAllMajorCategories = () => {
    if (allMajorCategories !== null && allMajorCategories.length > 0) {
      return (
        <>
          {
            Array.from(allMajorCategories).map((category, index) => {
              return (
                <button className="dropdown-item" key={index} onClick={(e) => {
                  e.preventDefault();
                  setSelectedMajorCategories(category)
                }}>{category}</button>
              )
            })
          }
        </>
      )
    }
  }

  const appendAllMinorCategories = () => {
    if (allMinorCategories !== null && allMinorCategories.length > 0) {
      return (
        <>
          {
            Array.from(allMinorCategories).map((category, index) => {
              return (
                <button className="dropdown-item" key={index} onClick={(e) => {
                  e.preventDefault();
                  setSelectedMinorCategories(category)
                }}>{category}</button>
              )
            })
          }
        </>
      )
    }
  }

  const appendMedPics = () => {
    if (medPics !== null || medPics !== "" || medPics.length > 0) {
      return (
        <>
          {
            Array.from(medPics).map((pic, index) => {
              return (
                <img src={URL.createObjectURL(pic)} alt={pic.name} key={index} className="h-28 rounded-lg transform hover:scale-110 transition duration-500" />
              )
            })
          }
        </>
      )
    }
  }

  return (
    <div>
      {flashMessage &&
        <div className="grid grid-cols-2 border-1 border-indigo-700 hover:shadow-lg p-2 rounded-lg">
          <span className="flex justify-start">{flashMessage}</span>
          <span className="cursor-pointer flex justify-end" onClick={() => setFlashMessage(false)}>&times;</span>
        </div>}
      <div className="grid grid-cols-1 gap-4 p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-start">Medicine Name</span>
            <input type="text" className="focus:outline-none border-1 border-gray-400 rounded-md focus:border-indigo-700 px-3 py-1" value={medName} onChange={(e) => setMedName(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <span className="text-start">Manufactured by</span>
            <input type="text" className="focus:outline-none border-1 border-gray-400 rounded-md focus:border-indigo-700 px-3 py-1" value={medMFR} onChange={(e) => setMedMFR(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-start">Major in</span>
            <input type="text" className="focus:outline-none border-1 border-gray-400 rounded-md focus:border-indigo-700 px-3 py-1" value={medMajor} onChange={(e) => setMedMajor(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <span className="text-start">Country of origin</span>
            <input type="text" className="focus:outline-none border-1 border-gray-400 rounded-md focus:border-indigo-700 px-3 py-1" value={medCOO} onChange={(e) => setMedCOO(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col w-full">
            <span className="text-start">Description</span>
            <textarea type="text" className="focus:outline-none border-1 border-gray-400 rounded-md focus:border-indigo-700 px-3 py-1" value={medDesc} onChange={(e) => setMedDesc(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-start">Key Benfits</span>
            <textarea type="text" className="focus:outline-none border-1 border-gray-400 rounded-md focus:border-indigo-700 px-3 py-1" value={medBenefit} onChange={(e) => setMedBenefit(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <span className="text-start">Direction for usage/dose</span>
            <textarea type="text" className="focus:outline-none border-1 border-gray-400 rounded-md focus:border-indigo-700 px-3 py-1" value={medDirection} onChange={(e) => setMedDirection(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-col text-start p-2 space-y-2">

          {toggleChangePics &&
            <div>
              <label for="medPic" className="border-1 space-x-4 p-2 border-gray-300 hover:border-indigo-700 rounded-lg h-36 items-center flex transition duration-700">
                <RiImageAddFill className="inline-block md:text-8xl text-4xl text-lightBlue-600 hover:text-rose-500 focus:text-rose-500 transition transform ease-in-out duration-700 hover:scale-110" />
                <div className="h-36 overflow-x-auto flex items-center space-x-2 w-full">
                  {appendMedPics()}
                </div>
              </label>
              <input type="file" accept="image/*" id="medPic" className="hidden" multiple="true" onChange={(e) => setMedPics(e.target.files)} />
            </div>}

        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span>Price</span>
            <input type="number" className="focus:outline-none border-1 border-gray-400 rounded-md focus:border-indigo-700 px-3 py-1" placeholder="₹ (0 means free)" value={medPrice} onChange={(e) => setMedPrice(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <span>Quantity</span>
            <input type="number" className="focus:outline-none border-1 border-gray-400 rounded-md focus:border-indigo-700 px-3 py-1" value={medQuantity} onChange={(e) => setMedQuantity(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <span>Date Added</span>
            <input type="date" className="focus:outline-none border-1 border-gray-400 rounded-md focus:border-indigo-700 px-3 py-1" value={medDateAdded} onChange={(e) => setMedDateAdded(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div class="dropdown">
            <button class="bg-white py-1 w-full rounded-lg border-1 border-gray-200 hover:border-indigo-500 transition duration-500 ease-in-out transform hover:shadow-lg" id="dropdownMajorCategory" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {(selectedMajorCategories) ? selectedMajorCategories : "Major Category"}
            </button>
            <div class="dropdown-menu transition duration-500 ease-in-out max-h-60 overflow-y-auto" aria-labelledby="dropdownMajorCategory">
              {appendAllMajorCategories()}
            </div>
          </div>
          <div class="dropdown">
            <button class="bg-white w-full py-1 rounded-lg border-1 border-gray-200 hover:border-indigo-500 transition duration-500 ease-in-out transform hover:shadow-lg" id="dropdownMinorCategory" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {(selectedMinorCategories) ? selectedMinorCategories : "Minor Category"}
            </button>
            <div class="dropdown-menu transition duration-500 ease-in-out max-h-60 overflow-y-auto" aria-labelledby="dropdownMinorCategory">
              {(allMinorCategories ? appendAllMinorCategories() : "Select A major category")}
            </div>
          </div>
          <div onClick={(e) => { setToggleChangePics(!toggleChangePics) }} className="transition duration-500 ease-in-out cursor-pointer flex justify-around items-center py-1 px-3 bg-white border-1 border-gray-200 hover:border-indigo-700 hover:shadow-lg rounded-lg">
            <span>Change Pictures</span>
          </div>
          <div onClick={(e) => handleUpdate(e)} className="transition duration-500 ease-in-out cursor-pointer flex justify-around items-center py-1 px-3 bg-white border-2 border-gray-50 hover:border-emerald-500 hover:shadow-xl rounded-lg">
            <span>Update</span>
          </div>
        </div>
      </div>
    </div>
  )
}
