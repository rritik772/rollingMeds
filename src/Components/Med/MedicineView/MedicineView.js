import React, { useState, useEffect } from 'react';
import { LOCALHOST } from "./../../../Constant";

import SingleMedicine from "./SingleMedicine";
import Loading from "./../../Static/Loading"
import SearchBar from "./SearchBar"
import { GiHamburgerMenu } from 'react-icons/gi';


function MedicineView({ searchByCategory, searchingTerm }) {
  const [medData, setMedData] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [searchTerm, setSearchTerm] = useState('none');
  const [major, setMajor] = useState('all');
  const [next, setNext] = useState(true);
  const [prev, setPrev] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const getMedData = async () => {
      if (pageNo === 0) setPrev(false);
      else setPrev(true);

      if (searchTerm === '') setSearchTerm('none')
      try {
        setLoading(true);
        const response = await fetch(`${LOCALHOST}get-all-med-data/${pageNo}/${(searchTerm === '')?'none':searchTerm}/${major}`);
        const data = await response.json();
        setLoading(false);

        console.log(data)
        setMedData(null)
        setMedData(data);

        if (data.medData === null || data.medData.length < 1 || data.medData === undefined) setNext(false)
        else setNext(true);

      } catch (error) {
        console.error(error)
      }
    }

    getMedData();
  }, [pageNo, searchTerm, major])


  const appendMedSingleContainer = () => {
    if (medData !== null && medData.medData.length > 0) {
      return (
        Array.from(medData.medData).map((data, key) => {
          return (
            <SingleMedicine medData={data} medImages={medData.medImages[key]} key={key} />
          )
        })
      )
    }
  }

  return (
    <div>
      {loading && <Loading />}
      <div className="flex flex-col items-center mb-24 space-y-4 md:space-y-8">
        <div className="container mx-auto space-y-4 mt-4">
          {loading !== true && <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
            {appendMedSingleContainer()}
          </div>}
        </div>
        <div className="flex border-1 border-gray-300 bg-white hover:shadow-lg hover:border-indigo-700 rounded-xl p-3 w-48 transition duration-500 ease-in-out">
          {prev && <button className="border-1 border-gray-300 hover:border-indigo-700 rounded-l-xl px-3 py-1 w-full" onClick={() => setPageNo(pageNo - 1)}>Prev</button>}
          {next && <button className="border-1 border-gray-300 hover:border-indigo-700 rounded-r-xl px-3 py-1 w-full" onClick={() => setPageNo(pageNo + 1)}>Next</button>}
        </div>
        <SearchBar onClick={(e) => setSearchTerm(e)} onChange={(e) => setMajor(e)} />
      </div>
    </div>
  )
}

export default MedicineView
