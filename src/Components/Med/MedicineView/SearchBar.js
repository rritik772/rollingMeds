import React, { useState, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { LOCALHOST } from './../../../Constant';

export default function SearchBar({ onClick, onChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [medMajor, setMedMajor] = useState(null);

  useEffect(() => {
    const getMedMajor = async () => {
      setMedMajor(null);

      const response = await fetch(`${LOCALHOST}get-all-major-medicine`);
      const data = await response.json();

      const newMajor = []
      for (let i = 0; i < data.length; i++) newMajor.push(data[i].major)
      setMedMajor(newMajor);
    }

    getMedMajor();
  }, [])

  const appendMajorCategory = () => {
    if (medMajor !== null) {
      return (
        Array.from(medMajor).map((cate, key) => {
          return (
            <button className="bg-white px-2 py-1 rounded-lg border-1 hover:border-indigo-700 border-gray-100 hover:shadow-lg trainsition duration-500" key={key} onClick={() => onChange(cate)}>{cate}</button>
          )
        })
      )
    }
  }


  return (
    <nav class="container mx-auto navbar navbar-expand-lg fixed-bottom navbar-light bg-light space-x-2 lg:space-x-4 p-2 border-b-4 border-indigo-700 mb-4 shadow-md rounded-t-lg">
      <div className="space-x-2">
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="py-1 px-2 border-1 outline-none border-gray-400 rounded-lg hover:border-indigo-700 focus:border-indigo-700 hover:shadow-lg focus:shadow-lg transition duration-500" />
        <button onClick={() => onClick(searchTerm)} className="bg-white px-2 py-1 rounded-lg border-1 hover:border-indigo-700 border-gray-400 hover:shadow-lg trainsition duration-500">Search</button>
      </div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-end" id="navbarNavAltMarkup">
        <div class="navbar-nav space-x-2">
          <button className="bg-white px-2 py-1 rounded-lg border-1 hover:border-indigo-700 border-gray-100 hover:shadow-lg trainsition duration-500" key={-1} onClick={() => onChange('all')}>All</button>
          {appendMajorCategory()}
        </div>
      </div>
    </nav>
  );
}
