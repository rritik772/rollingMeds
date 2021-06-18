import React, { useEffect, useState } from 'react'
import { LOCALHOST } from './../../../Constant';
import Loading from "./../../Static/Loading"
import ChangeUserRoleTableViewer from './ChangeUserRoleTableViewer'

export default function Main() {
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(false);

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
  }, [])

  if (loading || usersData === null) {
    return (<Loading />)
  } else {
    return (
      <table className="container space-x-4 bg-white p-2 border-1 border-gray-300 rounded-xl table cursor-not-allowed">
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
          {Array.from(usersData).map((data, key) => (
            <ChangeUserRoleTableViewer data={data} key={key} />
          ))}
        </tbody>
      </table>)
  }
}
