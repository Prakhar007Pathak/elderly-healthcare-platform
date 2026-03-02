import { Navigate } from "react-router-dom";

const RootRedirect = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "caregiver") return <Navigate to="/caregiver/dashboard" replace />;
  if (role === "family" || role === "elderly")
    return <Navigate to="/user/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export default RootRedirect;
