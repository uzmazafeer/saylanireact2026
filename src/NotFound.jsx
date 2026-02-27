import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="display-1 text-danger">404</h1>
      <p className="lead">Page not found.</p>
      <Link to="/" className="btn btn-primary">
        Go home
      </Link>
    </div>
  )
}
