import React from 'react';

import {CgPill} from 'react-icons/cg'

function Loading() {
    return (
        <div>
          <div className="p-5 container bg-white flex align-items-center flex-col rounded-xl border-2 border-gray-300 my-5 space-y-3">
            <CgPill className="animate-spin text-6xl text-blue-700"/>
            <h1 className="text-blue-700">Loading</h1>
            <span>If it shows for too long hit refresh</span>
          </div>
        </div>
    )
}

export default Loading
