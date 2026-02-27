import { Link, useLocation } from 'react-router-dom'

export default function NotFound() {
  const location = useLocation()

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm text-center p-4 p-md-5">
            <div className="mb-3">
              <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2">
                404 – Page Not Found
              </span>
            </div>
            <h2 className="mb-2 fw-bold text-primary">Oops! Page not found</h2>
            <p className="text-muted mb-4">
              The page <code>{location.pathname}</code> does not exist. It may have been moved
              or the URL is incorrect.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              <Link to="/dashboard" className="btn btn-primary px-4">
                Go to Dashboard
              </Link>
              <Link to="/login" className="btn btn-outline-secondary px-4">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

