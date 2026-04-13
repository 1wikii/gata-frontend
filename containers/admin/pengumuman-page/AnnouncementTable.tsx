"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Announcement } from "@/types/pengumuman";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface AnnouncementTableProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
  isLoading?: boolean;
}

export const AnnouncementTable: React.FC<AnnouncementTableProps> = ({
  announcements,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getPriorityBadgeStyles = (priority: string) => {
    return priority === "high"
      ? "bg-red-100 text-red-800 border border-red-200"
      : "bg-yellow-100 text-yellow-800 border border-yellow-200";
  };

  const getPublishBadgeStyles = (isPublished: boolean) => {
    return isPublished
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-gray-100 text-gray-800 border border-gray-200";
  };

  if (announcements.length === 0 && !isLoading) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-gray-500">Tidak ada pengumuman</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[30%]">Judul</TableHead>
            <TableHead className="w-[20%]">Status</TableHead>
            <TableHead className="w-[15%]">Prioritas</TableHead>
            <TableHead className="w-[20%]">Dibuat Oleh</TableHead>
            <TableHead className="w-[15%]">Tanggal</TableHead>
            <TableHead className="text-right w-[20%]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex flex-col">
                  <p className="font-medium text-gray-900 line-clamp-2">
                    {announcement.title}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                    {announcement.content}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {announcement.is_published ? (
                    <>
                      <Eye className="w-4 h-4 text-green-600" />
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getPublishBadgeStyles(
                          true
                        )}`}
                      >
                        Dipublikasi
                      </span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-gray-400" />
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getPublishBadgeStyles(
                          false
                        )}`}
                      >
                        Draft
                      </span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityBadgeStyles(
                    announcement.priority
                  )}`}
                >
                  {announcement.priority === "high" ? "Tinggi" : "Rendah"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p className="font-medium text-gray-900">
                    {announcement.user.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {announcement.user.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {formatDate(announcement.created_at)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(announcement)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(announcement)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
