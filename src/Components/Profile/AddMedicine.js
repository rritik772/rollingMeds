import React, {useState, useEffect} from 'react'
import { LOCALHOST } from "./../../Constant"

import {RiImageAddFill} from "react-icons/ri"

function AddMedicine({user}) {
    const [medName, setMedName] = useState("");
    const [medMFR, setMedMFR] = useState("");
    const [medMajor, setMedMajor] = useState("");
    const [medCOO, setMedCOO] = useState("");
    const [medDesc, setMedDesc] = useState("");
    const [medBenefit, setMedBenefit] = useState("");
    const [medDirection, setMedDirection] = useState("");
    const [medPics, setMedPics] = useState("");
    const [medPrice, setMedPrice] = useState("");
    const [medQuantity, setMedQuantity] = useState(0);
    const [medDateAdded, setMedDateAdded] = useState(null);
    const [flashMessage, setFlashMessage] = useState(false);

    const [allMajorCategories, setAllMajorCategories] = useState(null);
    const [allMinorCategories, setAllMinorCategories] = useState(null);
    const [selectedMajorCategories, setSelectedMajorCategories] = useState(null)
    const [selectedMinorCategories, setSelectedMinorCategories] = useState(null)

    useEffect(() => {
        const getAllMajorCategories = async () => {
                const response = await fetch(`${LOCALHOST}get-all-major-medicine-category`)
                const majorCategories = await response.json();

                const newMajor = []
                for (let i=0; i<majorCategories.length; i++) newMajor.push(majorCategories[i].major_cate)

                console.log(newMajor)
                setAllMajorCategories(newMajor);
            }
        getAllMajorCategories();
    }, [])

    useEffect(() => {
        const getAllMinorCategories = async () => {
                const response = await fetch(`${LOCALHOST}get-all-minor-medicine-category/${selectedMajorCategories}`)
                const minorCategories = await response.json();

                const newMinor = []
                for(let i=0; i<minorCategories.length; i++) newMinor.push(minorCategories[i].minor_cate)

                console.log(newMinor);
                setAllMinorCategories(newMinor)
            }
        getAllMinorCategories();
    }, [selectedMajorCategories])

    const appendAllMajorCategories = () => {
        if (allMajorCategories !== null && allMajorCategories.length > 0){
        return(
        <>
            {                    
                Array.from(allMajorCategories).map((category, index) => {
                    return(
                        <button className="dropdown-item" key={index} onClick={(e) => {
                            e.preventDefault();
                            setSelectedMajorCategories(category)
                        }}>{category}</button>
                    )
                })
            }
        </>
        )}
    }

    const appendAllMinorCategories = () => {
        if (allMinorCategories !== null && allMinorCategories.length > 0){
        return(
        <>
            {                    
                Array.from(allMinorCategories).map((category, index) => {
                    return(
                        <button className="dropdown-item" key={index} onClick={(e) => {
                            e.preventDefault();
                            setSelectedMinorCategories(category)
                        }}>{category}</button>
                    )
                })
            }
        </>
        )}
    }

    const handleAddMedicine = async (e) => {
        e.preventDefault();

        if (medName.length <= 4) setFlashMessage("Medicine name must be at least 4 characters");
        else if (medMFR.length <= 4) setFlashMessage("Medicine manufacture must be at least 4 characters");
        else if (medMajor <= 4) setFlashMessage("Medicine Major must be at least 4 characters");
        else if (medCOO <= 4) setFlashMessage("Medicine country of origin must be at least 4 characters");
        else if (medDesc <= 20) setFlashMessage("Medicine description must be at least 20 characters");
        else if (medPics && medPics.length < 1) setFlashMessage("At least 1 Medicine pictures **Required**");
        else if (medPrice === "") setFlashMessage("Medicine Price must be greater than or equal to zero.");
        else if (medQuantity === 0) setFlashMessage("Medicine Quantity must be greater than 0.");
        else{
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
            
            for (let i = 0; i < medPics.length; i++) formData.append("images", medPics[i]);

            const response = await fetch(`${LOCALHOST}add-medicine`, {
                method: 'POST',
                body: formData
            })

            const resp = await response.json();
            if(resp === "OK") {
                setFlashMessage("Medicine Added")

                setMedName("");
                setMedQuantity(0);
                setMedMajor("");
                setMedPrice(0);
                setMedDesc("");
                setMedMFR("");
                setMedCOO("");
                setMedBenefit("");
                setMedDirection("");
                setMedPics(null);
                setSelectedMajorCategories(null);
                setSelectedMinorCategories(null);


            }
            else setFlashMessage("Something went wrong.")
        }
    }

    const appendMedPics = () => {
        if (medPics !== null && medPics !== "" && medPics.length > 0){
        return(
            <>
                {
                    Array.from(medPics).map((pic, index) => {
                        return( 
                            <img src={URL.createObjectURL(pic)} alt={pic.name} key={index} className="h-28 rounded-lg transform hover:scale-110 transition duration-500"/>
                        )
                    })
                }
            </>
        )
        }
    }

    return (
        <div>
            <form onSubmit={(e) => handleAddMedicine(e)} encType="multipart/form-data">
            {flashMessage &&
            <div role="alert">
                <div className="container relative text-2xl font-bold border border-t-0 border-red-400 rounded-xl bg-blue-300 p-2 text-red-700 my-2">
                    <span className="mt-2 text-cyan-700">{flashMessage}</span>
                    <button className="absolute inset-y-0 right-3 text-4xl font-extrabold" onClick={() => setFlashMessage(false)}>&times;</button>
                </div>
            </div>
            }
                <div className="my-2 p-3 bg-white container rounded-xl space-y-2 border-1 border-gray-300">
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 lg:gap-4">
                        <div className="flex flex-wrap justify-between">
                            <span className="mx-2 text-lg font-bold">Medicine Name</span>
                            <input type="text" className="focus:outline-none border-1 border-gray-400 md:w-96 w-full rounded-md focus:border-indigo-700 px-3 py-1" value={medName} onChange={(e) => setMedName(e.target.value)}/>
                        </div>
                        <div className="flex flex-wrap justify-between">
                            <span className="mx-2 text-lg font-bold">Manufactured by</span>
                            <input type="text" className="focus:outline-none border-1 border-gray-400 md:w-96 w-full rounded-md focus:border-indigo-700 px-3 py-1" value={medMFR} onChange={(e) => setMedMFR(e.target.value)}/>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 lg:gap-4">
                        <div className="flex flex-wrap justify-between">
                            <span className="mx-2 text-lg font-bold">Major in</span>
                            <input type="text" className="focus:outline-none border-1 border-gray-400 md:w-96 w-full rounded-md focus:border-indigo-700 px-3 py-1" value={medMajor} onChange={(e) => setMedMajor(e.target.value)}/>
                        </div>
                        <div className="flex flex-wrap justify-between">
                            <span className="mx-2 text-lg font-bold">Country of origin</span>
                            <input type="text" className="focus:outline-none border-1 border-gray-400 md:w-96 w-full rounded-md focus:border-indigo-700 px-3 py-1" value={medCOO} onChange={(e) => setMedCOO(e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex flex-col text-start p-2 space-y-2">
                        <span className="text-lg font-bold">Description</span>
                        <textarea className="focus:outline-none border-1 border-gray-400 w-full rounded-md focus:border-indigo-700 px-3 py-1" value={medDesc} onChange={(e) => setMedDesc(e.target.value)}></textarea>
                    </div>
                    <div className="flex p-2 justify-around lg:space-x-2 flex-col lg:flex-row">
                        <div className="text-start w-full">
                            <span className="text-lg font-bold">Key Benefits</span>
                            <textarea className="focus:outline-none border-1 border-gray-400 w-full rounded-md focus:border-indigo-700 px-3 py-1" value={medBenefit} onChange={(e) => setMedBenefit(e.target.value)}></textarea>
                            <small className="text-muted">**Helpful if added</small>
                        </div>
                        <div className="text-start w-full">
                            <span className="text-lg font-bold">Direction for usage/dose</span>
                            <textarea className="focus:outline-none border-1 border-gray-400 w-full rounded-md focus:border-indigo-700 px-3 py-1" value={medDirection} onChange={(e) => setMedDirection(e.target.value)}></textarea>
                            <small className="text-muted">**Helpful if added</small>
                        </div>
                    </div>
                    <div className="flex flex-col text-start p-2 space-y-2">
                        <label for="medPic" className="border-1 space-x-4 p-2 border-gray-300 hover:border-indigo-700 rounded-lg h-36 items-center flex transition duration-700">
                            <RiImageAddFill className="inline-block md:text-8xl text-4xl text-lightBlue-600 hover:text-rose-500 focus:text-rose-500 transition transform ease-in-out duration-700 hover:scale-110" />
                            <div className="h-36 overflow-x-auto flex items-center space-x-2 w-full">
                                {appendMedPics()}
                            </div>
                        </label>
                        <input type="file" accept="image/*" id="medPic" className="hidden" multiple="true" onChange={(e) => setMedPics(e.target.files)}/>
                    </div>
                    <div className="flex items-center flex-wrap">
                        <div className="flex flex-wrap items-center col-4 justify-between">
                            <span className="mx-2 text-lg font-bold">Price (in rupee)</span>
                            <input type="number" className="mr-2 sm:my-2 lg:my-0 focus:outline-none py-1 px-2 rounded-lg text-lg border-1 border-gray-300 hover:border-rose-500 focus:border-rose-500 w-full md:w-96 transition duration-500" placeholder="₹ (0 means free)" value={medPrice} onChange={(e) => setMedPrice(e.target.value)}/>
                        </div>
                        <div className="flex flex-wrap items-center col-4 justify-between">
                            <span className="mx-2 text-lg font-bold">quantity</span>
                            <input type="number" className="mx-2 sm:my-2 lg:my-0 focus:outline-none py-1 px-2 rounded-lg text-lg border-1 border-gray-300 hover:border-rose-500 focus:border-rose-500 w-full md:w-96 transition duration-500" value={medQuantity} onChange={(e) => setMedQuantity(e.target.value)}/>
                        </div>
                        <div className="flex flex-wrap items-center col-4 justify-between">
                            <span className="mx-2 text-lg font-bold">Date Added</span>
                            <input type="date" className="mx-2 sm:my-2 lg:my-0 focus:outline-none py-1 px-2 rounded-lg text-lg border-1 border-gray-300 hover:border-rose-500 focus:border-rose-500 w-full md:w-96 transition duration-500" value={medDateAdded} onChange={(e) => setMedDateAdded(e.target.value)}/>
                        </div>
                    </div>
                    <div class="dropdown ml-4 flex justify-between flex-wrap items-center">
                        
                            <div class="dropdown mr-4">
                                <button class="sm:my-0 lg:my-3 bg-white mt-4 py-2 px-5 rounded-full border-1 border-gray-500 font-bold hover:border-indigo-500 transition duration-500 ease-in-out transform hover:shadow-lg" id="dropdownMajorCategory" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {(selectedMajorCategories)? selectedMajorCategories:"Major Category"}
                                </button>
                                <div class="dropdown-menu transition duration-500 ease-in-out max-h-60 overflow-y-auto" aria-labelledby="dropdownMajorCategory">
                                    {appendAllMajorCategories()}
                                </div>
                            </div>
                            <div class="dropdown ml-4">
                                <button class="sm:my-0 lg:my-3 bg-white mt-4 py-2 px-5 rounded-full border-1 border-gray-500 font-bold hover:border-indigo-500 transition duration-500 ease-in-out transform hover:shadow-lg" id="dropdownMinorCategory" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {(selectedMinorCategories)?selectedMinorCategories:"Minor Category"}
                                </button>
                                <div class="dropdown-menu transition duration-500 ease-in-out max-h-60 overflow-y-auto" aria-labelledby="dropdownMinorCategory">
                                    {(allMinorCategories?appendAllMinorCategories():"Select A major category")}
                                </div>
                            </div>
                        
                        <button type="submit" class="sm:my-0 lg:my-3 bg-white mt-4 py-2 px-5 rounded-full border-1 border-gray-500 font-bold hover:border-indigo-500 transition duration-500 ease-in-out transform hover:shadow-lg">Submit</button>
                    </div>
                </div> 
            </form>
        </div>
    )
}

export default AddMedicine
