export default function VerificationBadge({ status }) {

  if (status === "verified")
    return <span className="badge bg-success">✔ Verified</span>;

  if (status === "basic")
    return <span className="badge bg-warning text-dark">Basic</span>;

  return <span className="badge bg-secondary">Unverified</span>;
}
