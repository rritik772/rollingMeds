import React, { useState } from 'react'
import { LOCALHOST } from './../../Constant';
import { sha256 } from 'js-sha256';

export default function ChangePassphrase({ user }) {
  console.log(user)
  const [flashMessage, setFlashMessage] = useState(false);
  const [oldPasspharase, setOldPasspharase] = useState('');
  const [newPasspharase, setNewPasspharase] = useState('');
  const [newPasspharase1, setNewPasspharase1] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (oldPasspharase.length < 4) setFlashMessage('Old passpharase length must be grater than 4');
    else if (newPasspharase.length < 4 || newPasspharase1.length < 4) setFlashMessage('New passpharases length must be grater than 4');
    else if (newPasspharase1.length < 4 && newPasspharase.length < 4 && newPasspharase !== newPasspharase1) setFlashMessage("Both new passpharase must be same");
    else {

      const reciviedOldPasspharaseHash = sha256(oldPasspharase);
      if (reciviedOldPasspharaseHash !== user.passpharase) {
        setFlashMessage('wrong old passpharase');
        return;
      }

      const formData = new FormData();
      formData.append('user_id', user.user_id);
      formData.append('passpharase', sha256(newPasspharase));

      const response = await fetch (`${LOCALHOST}update-user-passpharase`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()

      if (data === "DONE") setFlashMessage('Passpharase Changed Successfully');
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
        <span style={{ fontFamily: 'Recursive' }} className="text-3xl text-blue-500">Change Passpharase</span>
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          <input value={oldPasspharase} onChange={(e) => setOldPasspharase(e.target.value)} type="passpharase" className="text-xl w-full border-1 border-gray-300 hover:border-indigo-700 focus:border-indigo-700 p-2 rounded-xl placeholder-opacity-50 transition duration-500 ease-in-out outline-none" placeholder="Enter old passpharase" />
          <input value={newPasspharase} onChange={(e) => setNewPasspharase(e.target.value)} type="passpharase" className="text-xl w-full border-1 border-gray-300 hover:border-indigo-700 focus:border-indigo-700 p-2 rounded-xl placeholder-opacity-50 transition duration-500 ease-in-out outline-none" placeholder="Enter new passpharase" />
          <input value={newPasspharase1} onChange={(e) => setNewPasspharase1(e.target.value)} type="passpharase" className="text-xl w-full border-1 border-gray-300 hover:border-indigo-700 focus:border-indigo-700 p-2 rounded-xl placeholder-opacity-50 transition duration-500 ease-in-out outline-none" placeholder="Confirm new passpharase" />
          <button type="submit" className="border-1 border-gray-200 hover:border-indigo-700 rounded-xl px-4 py-2 hover:shadow-xl transition duration-500 ease-in-out">Submit</button>
        </form>
      </div>
    </div>
  )
}
