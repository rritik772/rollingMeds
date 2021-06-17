import React, { useState } from 'react'
import { LOCALHOST } from './../../Constant';
import { sha256 } from 'js-sha256';
import { BiCheck } from "react-icons/bi";

export default function ChangePassword({ user }) {
  console.log(user)
  const [flashMessage, setFlashMessage] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [toggleOldPassword, setToggleOldPassword] = useState(true)

  const [toggleForgetgetPassword, setToggleForgetPassword] = useState(false);
  const [forgetPasswordPassphrase, setforgetPasswordPassphrase] = useState('')

  const checkPassphrase = (e) => {
    if (sha256(forgetPasswordPassphrase) === user.passphrase) {
      setToggleOldPassword(false);
      return;
    } else {
      setFlashMessage('Wrong passphrase');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (toggleOldPassword && oldPassword.length < 4) setFlashMessage('Old password length must be grater than 4');
    else if (newPassword.length < 4 || newPassword1.length < 4) setFlashMessage('New passwords length must be grater than 4');
    else if (newPassword1.length < 4 && newPassword.length < 4 && newPassword !== newPassword1) setFlashMessage("Both new password must be same");
    else {

      if (toggleOldPassword) {
        const reciviedOldPasswordHash = sha256(oldPassword);
        if (reciviedOldPasswordHash !== user.password) {
          setFlashMessage('wrong old password');
          return;
        }

      }

      const formData = new FormData();
      formData.append('user_id', user.user_id);
      formData.append('password', sha256(newPassword));

      const response = await fetch(`${LOCALHOST}update-user-password`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()

      if (data === "DONE") setFlashMessage('Password Changed Successfully');
      else setFlashMessage('Something went wrong')
    }
  }

  return (
    <div>
      <div className="flex flex-col mx-auto w-110 bg-white border-1 border-gray-300 rounded-xl hover:shadow-xl transition duration-500 space-y-8 ease-in-out p-5">
        {flashMessage &&
          <div className="flex justify-between items-center border-1 border-gray-200 hover:border-rose-500 px-3 py-2 rounded-full">
            {flashMessage}
            <button onClick={() => setFlashMessage(false)} className="text-3xl hover:text-rose-600">&times;</button>
          </div>}
        <span style={{ fontFamily: 'Recursive' }} className="text-3xl text-blue-500">Change Password</span>
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          {toggleOldPassword && <input value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type="password" className="text-xl w-full border-1 border-gray-300 hover:border-indigo-700 focus:border-indigo-700 p-2 rounded-xl placeholder-opacity-50 transition duration-500 ease-in-out outline-none" placeholder="Enter old password" />}
          <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="text-xl w-full border-1 border-gray-300 hover:border-indigo-700 focus:border-indigo-700 p-2 rounded-xl placeholder-opacity-50 transition duration-500 ease-in-out outline-none" placeholder="Enter new password" />
          <input value={newPassword1} onChange={(e) => setNewPassword1(e.target.value)} type="password" className="text-xl w-full border-1 border-gray-300 hover:border-indigo-700 focus:border-indigo-700 p-2 rounded-xl placeholder-opacity-50 transition duration-500 ease-in-out outline-none" placeholder="Confirm new password" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button type="button" onClick={() => setToggleForgetPassword(!toggleForgetgetPassword)} className="border-1 border-gray-200 hover:border-indigo-700 rounded-xl px-4 py-2 hover:shadow-xl transition duration-500 ease-in-out">Forget Password</button>
            <button type="submit" className="border-1 border-gray-200 hover:border-indigo-700 rounded-xl px-4 py-2 hover:shadow-xl transition duration-500 ease-in-out">Submit</button>
          </div>
        </form>
        {toggleForgetgetPassword &&
          <div className="flex space-x-4">
            <input value={forgetPasswordPassphrase} onChange={(e) => setforgetPasswordPassphrase(e.target.value)} type="text" className="text-xl font-md w-full border-1 border-gray-300 hover:border-indigo-700 focus:border-indigo-700 p-2 rounded-xl placeholder-opacity-50 transition duration-500 ease-in-out outline-none" placeholder="Enter passphrase" readOnly={(toggleOldPassword)?false:true} />
            <span onClick={(e) => checkPassphrase()} className={`p-1 border-1 ${(toggleOldPassword)?'border-gray-300':'border-green-500'} hover:border-indigo-700 hover:shadow-lg rounded-xl`}><BiCheck className="text-3xl text-gray-600" /></span>
          </div>}
      </div>
    </div>
  )
}
