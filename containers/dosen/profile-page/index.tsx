"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Loading from "@/components/ui/loading";
import {
  AdminProfile,
  AdminProfileFormState,
  ExpertiseGroup,
} from "@/types/admin-profile";
import { ProfileView } from "./ProfileView";
import { EditProfileForm } from "./EditProfileForm";
import {
  fetchDosenProfile,
  fetchExpertiseGroups,
  updateDosenProfile,
} from "./profileApi";

const ProfilePage = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [expertiseGroups, setExpertiseGroups] = useState<ExpertiseGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [profileData, groupsData] = await Promise.all([
        fetchDosenProfile(),
        fetchExpertiseGroups(),
      ]);

      setProfile(profileData);
      setExpertiseGroups(groupsData);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data profil");
      console.error("Error loading profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (formData: AdminProfileFormState) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateDosenProfile(formData);
      setIsEditing(false);
      setSuccessMessage("Profil berhasil diperbarui");

      // reload data
      loadData();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan profil");
      console.error("Error saving profile:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  // Loading state
  if (isLoading && !profile) {
    return <Loading />;
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="content-section w-full">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Gagal Memuat Profil</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 underline"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="content-section w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profil Dosen</h1>
        <p className="text-gray-600 mt-2">
          Kelola informasi profil dan kelompok keahlian Anda
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {isEditing ? (
          <>
            {/* Edit Form - Below Signature Section */}
            <div>
              <EditProfileForm
                profile={profile}
                expertiseGroups={expertiseGroups}
                isLoading={isLoading}
                onSubmit={handleSaveProfile}
                onCancel={handleCancelEdit}
              />
            </div>
          </>
        ) : (
          <ProfileView
            profile={profile}
            expertiseGroups={expertiseGroups}
            onEdit={() => setIsEditing(true)}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
