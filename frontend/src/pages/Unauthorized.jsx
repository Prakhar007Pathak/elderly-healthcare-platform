import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold text-red-600">
          Unauthorized Access
        </h1>
        <p className="text-sm text-slate-600">
          You do not have permission to view this page.
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

export default Unauthorized;
