import React from 'react'

export default function JobCard(job) {
  return (
  <>
      <div className="card mb-3">
      <div className="card-body">
        <h5>{job.title}</h5>
        <h6 className="text-muted">{job.company}</h6>
        <p>{job.location} • {job.experience}</p>
        <p>
          <strong>Skills:</strong> {job.skills.join(", ")}
        </p>
        <button className="btn btn-primary btn-sm">Apply</button>
      </div>
    </div>
  </>
  )
}
