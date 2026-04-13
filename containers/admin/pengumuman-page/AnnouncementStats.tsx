"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Eye, EyeOff, AlertCircle } from "lucide-react";

interface AnnouncementStatsProps {
  totalAnnouncements: number;
  publishedAnnouncements: number;
  draftAnnouncements: number;
  highPriorityAnnouncements: number;
}

export const AnnouncementStats: React.FC<AnnouncementStatsProps> = ({
  totalAnnouncements,
  publishedAnnouncements,
  draftAnnouncements,
  highPriorityAnnouncements,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {/* Total Announcements */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  Total Pengumuman
                </h3>
                <p className="text-sm text-gray-500">Keseluruhan pengumuman</p>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900">
                {totalAnnouncements}
              </div>
              <div className="text-sm text-gray-500">Pengumuman</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Published Announcements */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  Dipublikasi
                </h3>
                <p className="text-sm text-gray-500">Pengumuman aktif</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600">
              {publishedAnnouncements}
            </div>
            <div className="text-sm text-gray-500">Pengumuman</div>
          </div>
        </CardContent>
      </Card>

      {/* Draft Announcements */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <EyeOff className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Draft</h3>
                <p className="text-sm text-gray-500">
                  Pengumuman belum dipublikasi
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-600">
              {draftAnnouncements}
            </div>
            <div className="text-sm text-gray-500">Pengumuman</div>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Announcements */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  Prioritas Tinggi
                </h3>
                <p className="text-sm text-gray-500">Pengumuman penting</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-red-600">
              {highPriorityAnnouncements}
            </div>
            <div className="text-sm text-gray-500">Pengumuman</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
