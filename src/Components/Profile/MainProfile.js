import React, { useState, useEffect } from 'react'

import AddMedicine from './AddMedicine';
import UpdateMedicine from './UpdateMedicine'
import Main from "./ChangeUserRole/Main"
import ChangePassword from "./ChangePassword"
import ChangePassphrase from "./ChangePassphrase"
import ChangeUserInfo from "./ChangeUserInfo";

function MainProfile({ user }) {
  const [nowPage, setNowPage] = useState((user.roles === 'admin') ? <AddMedicine user={user} /> : <ChangeUserInfo user={user}/>);

  return (
    <div>
      <div className="border-t-4 border-indigo-500 bg-white p-2 container my-4 mx-auto transition duration-700 ease-in-out rounded-b-lg hover:shadow-lg">
        <div className="flex flex-wrap justify-center align-center">
          {(user.roles === 'admin' || user.roles === "Main admin") &&
            <div className="mx-2 p-2 text-center hover:shadow-lg cursor-pointer font-bold transition-all transform duration-700 border-1 border-gray-200 rounded-lg" onClick={() => setNowPage(<AddMedicine user={user} />)} >
              <span>Add Medicine</span>
            </div>}
          {(user.roles === "admin" || user.roles === "Main admin") &&
            <div className="mx-2 p-2 text-center hover:shadow-lg cursor-pointer font-bold transition-all transform duration-700 border-1 border-gray-200 rounded-lg" onClick={() => setNowPage(<UpdateMedicine />)}>
              <span>Update Medicine</span>
            </div>}
          {(user.roles === 'admin' || user.roles === "Main admin") &&
            <div onClick={() => setNowPage(<Main />)} className="mx-2 p-2 text-center hover:shadow-lg cursor-pointer font-bold transition-all transform duration-700 border-1 border-gray-200 rounded-lg" data-target="#Modal" data-toggle="modal">
              <span>Change user role</span>
            </div>}
          <div onClick={() => setNowPage(<ChangePassword user={user}/>)} className="mx-2 p-2 text-center hover:shadow-lg cursor-pointer font-bold transition-all transform duration-700 border-1 border-gray-200 rounded-lg" data-target="#Modal" data-toggle="modal">
            <span>Change Password</span>
          </div>
          <div onClick={() => setNowPage(<ChangePassphrase user={user}/>)} className="mx-2 p-2 text-center hover:shadow-lg cursor-pointer font-bold transition-all transform duration-700 border-1 border-gray-200 rounded-lg" data-target="#Modal" data-toggle="modal">
            <span>Change Passphrase</span>
          </div>
          {/* {user.roles !== 'admin' && */}
          {/*   <div className="mx-2 p-2 text-center hover:shadow-lg cursor-pointer font-bold transition-all transform duration-700 border-1 border-gray-200 rounded-lg" data-target="#Modal" data-toggle="modal"> */}
          {/*     <span>Order History</span> */}
          {/*   </div>} */}
          <div onClick={() => setNowPage(<ChangeUserInfo user={user}/>)} className="mx-2 p-2 text-center hover:shadow-lg cursor-pointer font-bold transition-all transform duration-700 border-1 border-gray-200 rounded-lg" data-target="#Modal" data-toggle="modal">
            <span>Change Info</span>
          </div>
        </div>
      </div>
      {nowPage && nowPage}
    </div>
  )
}

export default MainProfile
