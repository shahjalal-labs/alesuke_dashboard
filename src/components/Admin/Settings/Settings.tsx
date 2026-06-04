/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import profile from "@/assets/profile1.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SimpleLoader from "@/components/ui/SimpleLoader";
import {
  useChangePasswordMutation,
  useUpdateProfileMutation,
} from "@/redux/api/admin/dashboarApi";
import { useMyProfileQuery } from "@/redux/api/authApi";
import { Edit, Eye, EyeOff, Info, Loader, Save, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: profileData, isLoading, refetch } = useMyProfileQuery({});
  const [updateProfileFn, { isLoading: isUpdating }] =
    useUpdateProfileMutation();
  const [changePasswordFn, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const passwordForm = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profileData?.success && profileData?.result) {
      const user = profileData.result;
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        profileImage: user.profileImage || profile.src,
      });
    }
  }, [profileData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (profileData?.success && profileData?.result) {
        const user = profileData.result;
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email || "N/A",
          phone: user.phone || "N/A",
          profileImage: user.profileImage || profile.src,
        });
      }
      setSelectedImage(null);
      setImagePreview("");
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append(
        "phone",
        formData.phone === "N/A" ? "" : formData.phone,
      );

      if (selectedImage) {
        formDataToSend.append("profileImage", selectedImage);
      }

      const result = await updateProfileFn(formDataToSend).unwrap();

      if (result?.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        setSelectedImage(null);
        setImagePreview("");
        refetch();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onPasswordSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      const result = await changePasswordFn({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();

      if (result?.success) {
        toast.success("Password changed successfully");
        passwordForm.reset();
      }
    } catch (error: any) {
      console.error("Failed to change password:", error);
      toast.error(error.data?.message || "Failed to change password");
    }
  };

  const getImageSource = () => {
    if (imagePreview) {
      return imagePreview;
    }
    return formData.profileImage || profile.src;
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white p-6 sm:p-8">
          <SimpleLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="w-full flex-shrink-0 rounded-2xl bg-white p-4 sm:p-6 lg:w-80">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => setActiveTab("basic")}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                  activeTab === "basic"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-sm font-medium sm:text-base lg:text-lg">
                  Basic
                </span>
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("password")}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                  activeTab === "password"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-sm font-medium sm:text-base lg:text-lg">
                  Change Password
                </span>
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </aside>

          <main className="min-w-0 flex-1 rounded-2xl bg-white p-4 sm:p-6 lg:p-8">
            {activeTab === "basic" ? (
              <>
                <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <h1 className="text-lg font-medium text-gray-900 sm:text-xl">
                      Profile Information
                    </h1>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>

                  <Button
                    onClick={handleEditToggle}
                    variant={isEditing ? "outline" : "default"}
                    className="flex w-full items-center justify-center gap-2 sm:w-auto"
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4" />
                        Cancel
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-white">
                        <Edit className="h-4 w-4 text-white" />
                        Edit
                      </span>
                    )}
                  </Button>
                </div>

                <div className="mb-6 sm:mb-8">
                  <h2 className="mb-4 text-base font-medium text-gray-900">
                    Photo Profile
                  </h2>
                  <div className="relative inline-block">
                    <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                      <Image
                        src={getImageSource()}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        width={80}
                        height={80}
                      />
                    </div>

                    {isEditing && (
                      <label
                        htmlFor="profileImage"
                        className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                        <input
                          type="file"
                          id="profileImage"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {selectedImage && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {selectedImage.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-base font-medium text-gray-900">
                      First Name
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled={!isEditing}
                      className="h-14 w-full rounded-xl border-gray-200 px-4 text-base focus:border-orange-500 focus:ring-orange-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-base font-medium text-gray-900">
                      Last Name
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      disabled={!isEditing}
                      className="h-14 w-full rounded-xl border-gray-200 px-4 text-base focus:border-orange-500 focus:ring-orange-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-3 block text-base font-medium text-gray-900">
                      Email address
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      disabled
                      className="h-14 w-full cursor-not-allowed rounded-xl border-gray-200 bg-gray-100 px-4 text-base"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-3 block text-base font-medium text-gray-900">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Add phone number"
                      className="h-14 w-full rounded-xl border-gray-200 px-4 text-base focus:border-orange-500 focus:ring-orange-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8">
                    <Button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-medium text-white hover:bg-orange-600 sm:w-auto"
                    >
                      {isUpdating ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div>
                <div className="mb-6 flex items-center gap-2 sm:mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                    Change Password
                  </h2>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>

                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="w-full max-w-md space-y-6"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        {...passwordForm.register("oldPassword", {
                          required: "Current password is required",
                        })}
                        placeholder="Enter your current password"
                        className="w-full rounded-[8px] border border-gray-200 px-4 py-3 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.oldPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {passwordForm.formState.errors.oldPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        {...passwordForm.register("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                        placeholder="Enter your new password"
                        className="w-full rounded-[8px] border border-gray-200 px-4 py-3 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Must be at least 8 characters
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...passwordForm.register("confirmPassword", {
                          required: "Please confirm your password",
                        })}
                        placeholder="Confirm your new password"
                        className="w-full rounded-[8px] border border-gray-200 px-4 py-3 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600 sm:w-auto"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Changing Password...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}