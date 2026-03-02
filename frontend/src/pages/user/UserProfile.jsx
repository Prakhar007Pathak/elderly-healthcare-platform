import { useEffect, useState } from "react";
import UserCareLayout from "../../components/layout/UserCareLayout";
import Card from "../../components/ui/Card";
import API from "../../services/api";
import toast from "react-hot-toast";

const UserProfile = () => {
  const role = localStorage.getItem("role");

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",

    // elderly
    medicalConditions: "",
    mobilityStatus: "",
    emergencyContact: "",

    // caregiver
    qualification: "",
    experience: "",
    specialization: "",
    serviceAreas: "",
    availability: true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data);

        setForm({
          name: data.name || "",
          phone: data.phone || "",
          gender: data.gender || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          address: data.address || "",

          medicalConditions:
            data.patient?.medicalConditions?.join(", ") || "",
          mobilityStatus: data.patient?.mobilityStatus || "",
          emergencyContact: data.patient?.emergencyContact || "",

          qualification: data.caregiver?.qualification || "",
          experience: data.caregiver?.experience || "",
          specialization:
            data.caregiver?.specialization?.join(", ") || "",
          serviceAreas:
            data.caregiver?.serviceAreas?.join(", ") || "",
          availability: data.caregiver?.availability ?? true
        });

      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSave = async () => {
    try {
      await API.put("/auth/me", {
        ...form,

        medicalConditions: form.medicalConditions
          ? form.medicalConditions.split(",").map(i => i.trim())
          : [],

        specialization: form.specialization
          ? form.specialization.split(",").map(i => i.trim())
          : [],

        serviceAreas: form.serviceAreas
          ? form.serviceAreas.split(",").map(i => i.trim())
          : []
      });

      const updated = await API.get("/auth/me");
      setUser(updated.data);

      setEditing(false);

      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <UserCareLayout>
        <div className="p-8 text-sm text-slate-500">
          Loading profile...
        </div>
      </UserCareLayout>
    );
  }

  return (
    <UserCareLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Profile
          </h1>
          <p className="text-sm text-slate-500">
            Manage your account information
          </p>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className="text-sm bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Field label="Name" name="name" value={form.name} onChange={handleChange} editable={editing} />

          <StaticField label="Email" value={user.email} />

          <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} editable={editing} />

          <Field label="Gender" name="gender" value={form.gender} onChange={handleChange} editable={editing} />

          <Field label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} editable={editing} />

          <Field label="Address" name="address" value={form.address} onChange={handleChange} editable={editing} />

          {/* ================= ELDERLY ================= */}
          {role === "elderly" && (
            <>
              <Field
                label="Medical Conditions (comma separated)"
                name="medicalConditions"
                value={form.medicalConditions}
                onChange={handleChange}
                editable={editing}
                full
              />

              <Field
                label="Mobility Status"
                name="mobilityStatus"
                value={form.mobilityStatus}
                onChange={handleChange}
                editable={editing}
              />

              <Field
                label="Emergency Contact"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                editable={editing}
              />
            </>
          )}

          {/* ================= CAREGIVER ================= */}
          {role === "caregiver" && (
            <>
              <Field
                label="Qualification"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                editable={editing}
              />

              <Field
                label="Experience (years)"
                name="experience"
                type="number"
                value={form.experience}
                onChange={handleChange}
                editable={editing}
              />

              <Field
                label="Specialization (comma separated)"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                editable={editing}
                full
              />

              <Field
                label="Service Areas (comma separated)"
                name="serviceAreas"
                value={form.serviceAreas}
                onChange={handleChange}
                editable={editing}
                full
              />

              {editing && (
                <div className="md:col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="availability"
                    checked={form.availability}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-slate-700">
                    Available for new bookings
                  </span>
                </div>
              )}

              <StaticField
                label="Verification Status"
                value={user.caregiver?.verificationStatus || "pending"}
              />
            </>
          )}

          <StaticField
            label="Role"
            value={
              role === "family"
                ? "Family Manager"
                : role
            }
          />

        </div>

        {editing && (
          <div className="mt-8">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </Card>
    </UserCareLayout>
  );
};


// ---------- UI COMPONENTS ----------
const Field = ({ label, name, value, onChange, editable, type = "text", full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    {editable ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
      />
    ) : (
      <div className="text-sm text-slate-800 font-medium bg-slate-50 p-2 rounded-lg">
        {value || "-"}
      </div>
    )}
  </div>
);

const StaticField = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <div className="text-sm text-slate-800 font-medium bg-slate-100 p-2 rounded-lg capitalize">
      {value}
    </div>
  </div>
);

export default UserProfile;