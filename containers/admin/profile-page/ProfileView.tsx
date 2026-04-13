"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Mail,
  User,
  Badge,
  Hash,
  PenTool,
  AlertCircle,
} from "lucide-react";
import { AdminProfile, ExpertiseGroup } from "@/types/admin-profile";

interface ProfileViewProps {
  profile: AdminProfile;
  expertiseGroups: ExpertiseGroup[];
  onEdit: () => void;
  isLoading: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  expertiseGroups,
  onEdit,
  isLoading,
}) => {
  const [signatureError, setSignatureError] = useState(false);

  const profileFields = [
    {
      label: "Nama",
      value: profile.name,
      icon: User,
    },
    {
      label: "NIP",
      value: profile.nip,
      icon: Hash,
    },
    {
      label: "Inisial",
      value: profile.initials,
      icon: Badge,
    },
    {
      label: "Email",
      value: profile.email,
      icon: Mail,
    },
    {
      label: "Nomor WhatsApp",
      value: profile.whatsapp_number || "-",
      icon: MessageCircle,
    },
  ];

  const getExpertiseGroupName = (groupId: any) => {
    if (!groupId) return "-";
    const group = expertiseGroups.find((g) => g.id === groupId);
    return group ? group.name : `ID: ${groupId}`;
  };

  const getSignatureUrl = (): string | null => {
    // Prefer base64 data if available (no CORS issues)
    if (profile.signature_data) {
      // Ensure proper base64 data URI format
      if (profile.signature_data.startsWith("data:image")) {
        return profile.signature_data;
      }
      // Add data URI prefix if missing
      return `data:image/png;base64,${profile.signature_data}`;
    }

    // Fallback to signature_url with full base URL
    if (profile.signature_url) {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
      if (baseUrl) {
        return baseUrl + profile.signature_url;
      }
      // If no base URL configured, return relative URL
      return profile.signature_url;
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Profile Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileFields.map((field) => {
          const Icon = field.icon;
          return (
            <div
              key={field.label}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                  </p>
                  <p className="text-gray-900 break-all">{field.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expertise Groups */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Kelompok Keahlian
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => {
            const groupId =
              profile[`expertise_group_${index}` as keyof AdminProfile];
            return (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Kelompok Keahlian {index}
                </p>
                <p className="text-gray-900 font-medium">
                  {getExpertiseGroupName(groupId)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Signature Section */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-4">
          <PenTool className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Tanda Tangan</h3>
        </div>

        {profile.signature_data ? (
          // Priority: Use base64 data (no CORS issues)
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-center">
            <img
              src={`data:image/png;base64,${profile.signature_data}`}
              alt="Tanda tangan"
              className="max-h-32 max-w-sm object-contain"
            />
          </div>
        ) : profile.signature_url && !signatureError ? (
          // Fallback: Try to load from URL (may have CORS issues)
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-center">
            <img
              src={getSignatureUrl() || undefined}
              alt="Tanda tangan"
              className="max-h-52 max-w-sm object-contain"
            />
          </div>
        ) : (
          // Empty state: No signature
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium text-sm">
                Tanda Tangan Belum Ditambahkan
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Silakan tambahkan tanda tangan Anda dengan mengklik tombol "Edit
                Profil" di bawah.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Button */}
      <button
        onClick={onEdit}
        disabled={isLoading}
        className="w-full px-4 py-2.5 text-white bg-primary hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 mt-6"
      >
        Edit Profil
      </button>
    </div>
  );
};
