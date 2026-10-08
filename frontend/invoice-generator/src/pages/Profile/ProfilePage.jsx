import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loader2, User, Mail, Building, Phone, MapPin } from "lucide-react";
import axiosInstance from "../../utils/axiousInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextareaField";


const ProfilePage = () => {

  const { user, loading, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    address: "",
    phone: ""
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        businessName: user.businessName || "",
        address: user.address || "",
        phone: user.phone || ""
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, formData);
      updateUser(response.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">My Profile</h3>
      </div>

      <form onSubmit={handleUpdateProfile}>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="text-slate-400 h-5 w-5" />
              </div>
              <input type="email" readOnly value={user?.email || ""} className="bg-slate-50 pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full text-slate-500 disabled:cursor-not-allowed" disabled />
            </div>
          </div>

          <InputField
            label="Full Name"
            name="name"
            icon={User}
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
          />

          <div className="pt-6 border-t border-slate-200">
            <h4 className="text-lg font-medium text-slate-900">Business Information</h4>
            <p className="text-sm text-slate-500 mt-1 mb-4">This will be used to pre-fill the "Bill From" section of your invoices.</p>
            <div className="space-y-4">
              <InputField
                label="Business Name"
                name="businessName"
                icon={Building}
                type="text"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Your Company LLC"
              />
              <TextareaField
                label="Address"
                name="address"
                icon={MapPin}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main St, City/Town, Zip Code"
              />
              <InputField
                label="Phone Number"
                name="phone"
                icon={Phone}
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(+000) 123-456-7890"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button type="submit" disabled={isUpdating} className="inline-flex items-center justify-center bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium transition-colors duration-200 px-4 py-2 h-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed gap-2">
            {isUpdating ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
};

export default ProfilePage;
