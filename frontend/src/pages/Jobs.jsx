import React from 'react'
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
export default function Jobs() {
  return (
<>
  <Navbar />
      <div className="container mt-4">
        <h3>Recommended Jobs</h3>
        <Feed />
      </div>
    </>
  )
}
