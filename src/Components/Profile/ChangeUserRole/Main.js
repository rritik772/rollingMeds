import React, { useEffect, useState } from 'react'
import { LOCALHOST } from './../../../Constant';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiCheckCircle } from 'react-icons/bi'
import Loading from "./../../Static/Loading"

export default function Main() {
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userDataKey, setUserDataKey] = useState(null);
  const [toggleDeleteUser, setToggleDeleteUser] = useState(false);
  const [toggleUserRole, setToggleUserRole] = useState(false);
  const [flashMessage, setFlashMessage] = useState(false);

  useEffect(() => {
    const getUserdata = async () => {
      setLoading(true);

      const response = await fetch(`${LOCALHOST}get-all-users`);
      const data = await response.json();

      console.log(data)
      setUsersData(data)
      setLoading(false);
    }
    getUserdata();
  }, [userDataKey])

  const changeUserRole = async () => {
    const formData = new FormData();

    formData.append('user_id', usersData[userDataKey].user_id);
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

    console.log(userDataKey)
    const response = await fetch(`${LOCALHOST}delete-user/${usersData[userDataKey].user_id}`)
    const data = await response.json();

    if (data === "DONE") setFlashMessage("Delete user successfully");
    else setFlashMessage('Something went wrong');
  }
  console.log(userDataKey)

  const appendTableRows = () => {
    if (usersData !== null && usersData.length > 0) {
      return (
        Array.from(usersData).map((data, key) => (
          <tr className="hover:bg-gray-100 transition duration-300 ease-in-out" key={key}>
            <td className="text-left">{data.full_name}</td>
            <td className="text-left">{data.doctor_type}</td>
            <td className="text-left">{data.doctor_name}</td>
            {
              <div className="dropdown">
                <td className="text-left dropdown-toggle cursor-pointer hover:text-indigo-800 transition duration-500 ease-in-out" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{data.roles}</td>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <button onClick={() => {
                    setUserDataKey(key);
                    setToggleUserRole('user')
                  }} className="dropdown-item">user</button>
                  <button onClick={() => {
                    setUserDataKey(key);
                    setToggleUserRole('admin')
                  }} className="dropdown-item">admin</button>
                </div>
              </div>}
            {data.roles !== 'admin' &&
              <td className="space-x-3 text-start">
                <AiOutlineDelete data-toggle="modal" onClick={() => {
                  setUserDataKey(key);
                  setToggleDeleteUser(true);
                }} data-target="#OnDeleteModal" className="inline-block text-gray-600 text-2xl border-1 border-gray-500 hover:border-indigo-700 p-1 rounded-md hover:shadow-lg cursor-pointer" />
                <BiCheckCircle onClick={() => changeUserRole()} className="inline-block text-gray-600 text-2xl border-1 border-gray-500 hover:border-indigo-700 p-1 rounded-md hover:shadow-lg cursor-pointer" />
              </td>}
          </tr>
        )))
    } else {
      <Loading />
    }
  }
  return (
    <div className="container space-x-4 bg-white p-2 border-1 border-gray-300 rounded-xl">
      {flashMessage &&
        <div className="px-4 py-2 flex justify-between border-1 border-gray-200 hover:border-indigo-700 rounded-xl">
          {flashMessage}
          <button onClick={() => setFlashMessage(false)} className="text-xl">&times;</button>
        </div>}
      <table className="table cursor-not-allowed">
        <thead className="thead-light">
          <tr>
            <th className="text-left" scope="col">Full name</th>
            <th className="text-left" scope="col">doctor type</th>
            <th className="text-left" scope="col">doctor name</th>
            <th className="text-left" scope="col">role</th>
            <th className="text-left" scope="col">Options</th>
          </tr>
        </thead>
        <tbody className="space-y-2">
          {appendTableRows()}
        </tbody>
      </table>

      {toggleDeleteUser &&
        <div className="modal fade" id="OnDeleteModal" tabIndex="-1" data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="OnDeleteEditLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-start" id="OnDeleteModalLabel">{usersData[userDataKey].full_name}</h5>
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

    </div>
  )
}
