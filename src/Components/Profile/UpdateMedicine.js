import React, { useState, useEffect } from 'react';
import SearchBar from './../Med/MedicineView/SearchBar'
import { LOCALHOST } from "./../../Constant"
import MedicineUpdateTableViewer from "./UpdateView/MedicineUpdateTableViewer"

export default function UpdateMedicine() {
  const [searchTerm, setSearchTerm] = useState('none');
  const [major, setMajor] = useState('all');
  const [pageNo, setPageNo] = useState(0);
  const [medData, setMedData] = useState(0);
  const [next, setNext] = useState(true);
  const [prev, setPrev] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const getMedData = async () => {

      if (pageNo === 0) setPrev(false);
      else setPrev(true);

      console.log(searchTerm, major)
      if (searchTerm === '') setSearchTerm('none')
      try {
        setLoading(true);
        const response = await fetch(`${LOCALHOST}update-get-all-med-data/${pageNo}/${searchTerm}/${major}`);
        const data = await response.json();
        setLoading(false);

        console.log(data)
        setMedData(null)
        setMedData(data);

        if (Array.from(data).length < 1) setNext(false)
        else setNext(true);

      } catch (error) {
        console.error(error)
      }
    }

    getMedData();
  }, [pageNo, searchTerm, major])


  return (
    <>
      { (medData !== undefined && medData !== null && medData.length > 0) && <MedicineUpdateTableViewer medData={medData} />}
      <SearchBar onClick={(e) => setSearchTerm(e)} onChange={(e) => setMajor(e)} />
      <div className="flex justify-center mt-4 mb-10 items-center mx-auto border-1 border-gray-300 bg-white hover:shadow-lg hover:border-indigo-700 rounded-xl p-3 w-48 transition duration-500 ease-in-out">
        {prev && <button className="border-1 border-gray-300 hover:border-indigo-700 rounded-l-xl px-3 py-1 w-full" onClick={() => setPageNo(pageNo - 1)}>Prev</button>}
        {next && <button className="border-1 border-gray-300 hover:border-indigo-700 rounded-r-xl px-3 py-1 w-full" onClick={() => setPageNo(pageNo + 1)}>Next</button>}
      </div>
    </>
  )
}
