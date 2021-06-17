import React, { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { LOCALHOST } from "./../../../Constant"
import UpdateMedicineModal from "./UpdateMedicineModal";

export default function MedicineUpdateTableViewer({ medData }) {
  const [medDataKey, setMedDataKey] = useState(0);
  const [message, setMessage] = useState('');
  const [toggleUpdateMedicine, setToggleUpdateMedicine] = useState(false);

  const appendTableRows = () => {
    return (
      Array.from(medData).map((data, key) => (
        <tr className="hover:bg-gray-100 transition duration-300 ease-in-out" key={key}>
          <td className="text-left">{data.name}</td>
          <td className="text-left">₹{data.price}</td>
          <td className="text-left">{data.major_type}</td>
          <td className="text-left">{data.minor_type}</td>
          <td className="space-x-3">
            <AiOutlineEdit data-toggle="modal" data-target="#OnEditModal" onClick={() => {
              setToggleUpdateMedicine(true);
              setMedDataKey(key);
            }} className="inline-block text-gray-600 text-2xl border-1 border-gray-500 hover:border-indigo-700 p-1 rounded-md hover:shadow-lg cursor-pointer" />
            <AiOutlineDelete data-toggle="modal" onClick={() => setMedDataKey(key)} data-target="#OnDeleteModal" className="inline-block text-gray-600 text-2xl border-1 border-gray-500 hover:border-indigo-700 p-1 rounded-md hover:shadow-lg cursor-pointer" />
          </td>
        </tr>
      ))
    )
  }

  const handleOnDelete = async (key) => {
    const med_id = medData[key].med_id;
    const formData = new FormData();
    formData.append("med_id", med_id);

    const response = await fetch(`${LOCALHOST}delete-medicine-entry`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json();
    if (data === "DONE") setMessage("DELETED");
    else setMessage("Something went wrong")
  }

  return (
    <div className="table-responsive container bg-white p-2 rounded-lg border-1 border-gray-300">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th className="text-left" scope="col">Name</th>
            <th className="text-left" scope="col">Price</th>
            <th className="text-left" scope="col">Major Type</th>
            <th className="text-left" scope="col">Minor Type</th>
            <th className="text-left" scope="col">Options</th>
          </tr>
        </thead>
        <tbody className="space-y-2">
          {appendTableRows()}
        </tbody>
      </table>
      <div className="modal fade" id="OnDeleteModal" tabindex="-1" data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="OnDeleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-start" id="OnDeleteModalLabel">Delete a entry</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <span className="text-lg">{medData && medData[medDataKey].name}</span>
              <h4 className="text-rose-500">{message}</h4>
            </div>
            <div className="modal-footer space-x-3">
              <button type="button" className="bg-white px-2 py-1 rounded-lg border-1 hover:border-indigo-700 border-gray-100 hover:shadow-lg trainsition duration-500" data-dismiss="modal">Close</button>
              <button onClick={() => handleOnDelete(medDataKey)} type="button" className="hover:text-white px-2 py-1 rounded-lg border-1 hover:border-rose-500 hover:bg-rose-500 border-rose-500 hover:shadow-lg trainsition duration-500">Delete</button>
            </div>
          </div>
        </div>
      </div>

      {toggleUpdateMedicine &&
       <div className="modal fade" id="OnEditModal" tabindex="-1" data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="OnDeleteEditLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-start" id="OnDeleteModalLabel">Update a entry</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setToggleUpdateMedicine(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <span className="text-lg">{ medData.length > 0 && <UpdateMedicineModal medData={medData[medDataKey]} />}</span>
            </div>
          </div>
        </div>
      </div>}

    </div>
  )
}
