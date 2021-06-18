import React, { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiCheckCircle } from 'react-icons/bi'
import Loading from "./../../Static/Loading"
import { LOCALHOST } from "./../../../Constant"

export default function ChangeUserRoleTableViewer({ data, key }) {

  const [userData, setUserData] = useState(data);
  const [loading, setLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState(false);
  const [toggleUserRole, setToggleUserRole] = useState(userData.roles);
  const [toggleDeleteUser, setToggleDeleteUser] = useState(false);

  const changeUserRole = async () => {
    const formData = new FormData();

    formData.append('user_id', userData.user_id);
    formData.append('roles', toggleUserRole);

    const response = await fetch(`${LOCALHOST}change-user-role`, {
      method: 'POST',
      body: formData
    })
    const data = await response.json();
    console.log(data)
    if (data === "DONE") setFlashMessage('Changed user roles successfully');
    else setFlashMessage('Something went wrong');
  }

  const handleOnDelete = async (e) => {
    e.preventDefault();

    const response = await fetch(`${LOCALHOST}delete-user/${userData.user_id}`)
    const data = await response.json();

    if (data === "DONE") setFlashMessage("Delete user successfully");
    else setFlashMessage('Something went wrong');
  }

  return (
    <tr className="hover:bg-gray-100 transition duration-300 ease-in-out" key={key}>
      <td className="text-left">{userData.full_name}</td>
      <td className="text-left">{userData.doctor_type}</td>
      <td className="text-left">{userData.doctor_name}</td>
      {
        <div className="dropdown">
          <td className="text-left dropdown-toggle cursor-pointer hover:text-indigo-800 transition duration-500 ease-in-out" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{toggleUserRole}</td>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <button onClick={() => {
              setToggleUserRole('user')
            }} className="dropdown-item">user</button>
            <button onClick={() => {
              setToggleUserRole('admin')
            }} className="dropdown-item">admin</button>
          </div>
        </div>}
      {data.roles !== 'Main admin' &&
        <td className="space-x-3 text-start">
          <AiOutlineDelete data-toggle="modal" onClick={() => {
            setToggleDeleteUser(true);
          }} data-target="#OnDeleteModal" className="inline-block text-gray-600 text-2xl border-1 border-gray-500 hover:border-indigo-700 p-1 rounded-md hover:shadow-lg cursor-pointer" />
          <BiCheckCircle data-toggle="modal" data-target="#exampleModal" onClick={() => {
            setFlashMessage(true)
            changeUserRole()
          }} className="inline-block text-gray-600 text-2xl border-1 border-gray-500 hover:border-indigo-700 p-1 rounded-md hover:shadow-lg cursor-pointer" />
        </td>}

      {toggleDeleteUser &&
        <div className="modal fade" id="OnDeleteModal" tabIndex="-1" data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="OnDeleteEditLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-start" id="OnDeleteModalLabel">{data.full_name}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setToggleDeleteUser(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <span className="text-lg">Are you sure you want to delete this user?</span>
              </div>
              <div className="modal-footer space-x-3">
                <button type="button" className="bg-white px-2 py-1 rounded-lg border-1 hover:border-indigo-700 border-gray-100 hover:shadow-lg trainsition duration-500" data-dismiss="modal" onClick={() => setToggleDeleteUser(false)}>Close</button>
                <button onClick={(e) => handleOnDelete(e)} type="button" className="hover:text-white px-2 py-1 rounded-lg border-1 hover:border-rose-500 hover:bg-rose-500 border-rose-500 hover:shadow-lg trainsition duration-500">Delete</button>
              </div>
            </div>
          </div>
        </div>}

      {flashMessage &&
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" data-keyboard="false" data-backdrop="static" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">{userData.full_name}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true" onClick={() => setFlashMessage(false)}>&times;</span>
                </button>
              </div>
              <div class="modal-body">
                {flashMessage}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onClick={() => setFlashMessage(false)} data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      }

    </tr>
  )
}
