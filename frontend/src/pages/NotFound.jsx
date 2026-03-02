import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold">404</h1>
        <p className="text-sm text-slate-600">
          Page not found
        </p>

        <Link
          to="/login"
          className="text-sm text-blue-600 hover:underline"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
