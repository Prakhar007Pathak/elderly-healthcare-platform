import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Blogs from "../pages/Blogs";


import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import UserProfile from "../pages/user/UserProfile";
import UserDashboard from "../pages/user/UserDashboard";
import BookService from "../pages/user/BookService";
import MyBookings from "../pages/user/MyBookings";
import ManagePatients from "../pages/user/ManagePatients";
import Services from "../pages/user/Services";
import ServiceDetails from "../pages/user/ServiceDetails";
import PublicCaregiverProfile from "../pages/user/PublicCaregiverProfile";

import CaregiverDashboard from "../pages/caregiver/CaregiverDashboard";
import Requests from "../pages/caregiver/Requests";
import MyJobs from "../pages/caregiver/MyJobs";
import MyServices from "../pages/caregiver/MyServices";
import AddService from "../pages/caregiver/AddService";
import EditService from "../pages/caregiver/EditService";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCaregivers from "../pages/admin/AdminCaregivers";
import AdminBookings from "../pages/admin/AdminBookings";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminContacts from "../pages/admin/AdminContacts";


import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* USER ROUTES */}

      <Route
        path="/user/profile"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["family", "elderly", "caregiver"]}>
              <UserProfile />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/user/dashboard"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["family", "elderly"]}>
              <UserDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />


      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetails />} />


      <Route
        path="/user/book"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["family", "elderly"]}>
              <BookService />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/user/bookings"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["family", "elderly"]}>
              <MyBookings />
            </RoleRoute>
          </PrivateRoute>
        }
      />


      {/* manage patients only for family */}
      <Route
        path="/user/manage-patients"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["family"]}>
              <ManagePatients />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/caregiver/public/:id"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["family", "elderly"]}>
              <PublicCaregiverProfile />
            </RoleRoute>
          </PrivateRoute>
        }
      />



      {/* CAREGIVER ROUTES */}

      <Route
        path="/caregiver/profile"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["caregiver"]}>
              <UserProfile />
            </RoleRoute>
          </PrivateRoute>
        }
      />


      <Route
        path="/caregiver/dashboard"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["caregiver"]}>
              <CaregiverDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/caregiver/requests"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["caregiver"]}>
              <Requests />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/caregiver/jobs"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["caregiver"]}>
              <MyJobs />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/caregiver/services"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["caregiver"]}>
              <MyServices />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/caregiver/services/add"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["caregiver"]}>
              <AddService />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/caregiver/services/:id/edit"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["caregiver"]}>
              <EditService />
            </RoleRoute>
          </PrivateRoute>
        }
      />



      {/* ADMIN ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/caregivers"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <AdminCaregivers />
            </RoleRoute>
          </PrivateRoute>
        }
      />


      <Route
        path="/admin/bookings"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <AdminBookings />
            </RoleRoute>
          </PrivateRoute>
        }
      />


      <Route
        path="/admin/users"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/contacts"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <AdminContacts />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;
