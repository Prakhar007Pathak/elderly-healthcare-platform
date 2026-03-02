import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserHeader from "./UserHeader";
import Footer from "./Footer";
import API from "../../services/api";
import toast from "react-hot-toast";


const UserCareLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showBanner, setShowBanner] = useState(false);
  const [bannerType, setBannerType] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const dismissed = localStorage.getItem("onboardingDismissed");

      if (
        location.pathname === "/user/profile" ||
        location.pathname === "/user/manage-patients"
      ) {
        return;
      }

      if (dismissed === "true") return;

      try {
        const { data } = await API.get("/auth/me");

        // ELDERLY
        if (data.role === "elderly" && data.profileCompleted === false) {
          setBannerType("elderly");
          setShowBanner(true);
          return;
        }

        // FAMILY
        if (data.role === "family") {
          const patientsRes = await API.get("/patients/my");
          if (patientsRes.data.length === 0) {
            setBannerType("family");
            setShowBanner(true);
            return;
          }
        }

        // CAREGIVER
        if (data.role === "caregiver") {
          if (!data.profileCompleted) {
            setBannerType("caregiver-profile");
            setShowBanner(true);
            return;
          }

          if (
            data.caregiver &&
            data.caregiver.verificationStatus !== "verified"
          ) {
            setBannerType("caregiver-verification");
            setShowBanner(true);
            return;
          }
        }

      } catch (error) {
        if (error.response?.status === 401) {
          return;
        }

        toast.error(
          error.response?.data?.message ||
          error.message ||
          "Something went wrong"
        );
      }
    };

    checkOnboarding();
  }, [location.pathname]);

  const handleAction = () => {
    navigate("/user/profile");
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("onboardingDismissed", "true");
    setShowBanner(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <UserHeader />

      {showBanner && (
        <div className="max-w-6xl mx-auto w-full px-6 mt-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 flex justify-between items-center shadow-sm">

            <div className="text-sm">
              {bannerType === "elderly" &&
                "Complete your profile to receive better personalized care."}

              {bannerType === "family" &&
                "Add family members to start booking healthcare services."}

              {bannerType === "caregiver-profile" &&
                "Please complete your caregiver profile for verification."}

              {bannerType === "caregiver-verification" &&
                "Your profile is under admin verification."}
            </div>

            <div className="flex items-center gap-3">
              {(bannerType === "elderly" ||
                bannerType === "family" ||
                bannerType === "caregiver-profile") && (
                  <button
                    onClick={handleAction}
                    className="text-xs font-medium bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                  >
                    Complete Profile
                  </button>
                )}

              <button
                onClick={handleDismiss}
                className="text-blue-500 hover:text-blue-700 text-lg leading-none"
              >
                ×
              </button>
            </div>

          </div>
        </div>
      )}

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default UserCareLayout;