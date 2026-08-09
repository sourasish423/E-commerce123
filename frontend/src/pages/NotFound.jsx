import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-md mx-auto px-4 py-24 text-center">
    <p className="price-tag mx-auto w-fit">404 · Page not found</p>
    <h1 className="font-display text-page-title mt-6">We couldn't find that page.</h1>
    <p className="text-slate-450 mt-3">
      The page you're looking for may have been moved or no longer exists.
    </p>
    <Link to="/" className="btn-primary mt-8 inline-flex">
      Return to homepage
    </Link>
  </div>
);

export default NotFound;
