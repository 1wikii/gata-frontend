"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import KetersediaanCard from "@/components/cards/KetersediaanCard";
import KetersediaanDialog from "@/components/dialogs/KetersediaanDialog";
import DeleteConfirmDialog from "@/components/dialogs/DeleteConfirmDialog";
import { KetersediaanDosen } from "@/types/ketersediaan";
import { getDayName, DaysType } from "@/utils/dateHelper";

import { Plus, CalendarClock, Info } from "lucide-react";

interface Props {
  getKetersediaan: () => Promise<any>;
  onSave: (data: any) => Promise<any>;
  onDelete: (id: number) => Promise<any>;
}

// Mock data - replace with actual API call
// const mockKetersediaan: KetersediaanDosen[] = [
//   { id: 1, day_of_week: "1", start_time: "10:30:00", end_time: "12:00:00" },
//   { id: 2, day_of_week: "1", start_time: "14:00:00", end_time: "15:30:00" },
//   { id: 3, day_of_week: "2", start_time: "09:00:00", end_time: "11:00:00" },
//   { id: 4, day_of_week: "3", start_time: "13:00:00", end_time: "15:00:00" },
//   { id: 5, day_of_week: "3", start_time: "15:30:00", end_time: "17:00:00" },
//   { id: 6, day_of_week: "4", start_time: "08:00:00", end_time: "10:00:00" },
//   { id: 7, day_of_week: "5", start_time: "10:00:00", end_time: "12:00:00" },
// ];

const JadwalPage: React.FC<Props> = ({ getKetersediaan, onSave, onDelete }) => {
  const [ketersediaanList, setKetersediaanList] = useState<KetersediaanDosen[]>(
    []
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedKetersediaan, setSelectedKetersediaan] =
    useState<KetersediaanDosen | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch ketersediaan on mount
  useEffect(() => {
    fetchKetersediaan();
  }, []);

  const fetchKetersediaan = async () => {
    try {
      const response = await getKetersediaan();
      const data = await response.json();
      if (response.ok && data) {
        setKetersediaanList(data.data);
      }
    } catch (error) {
      console.error("Error fetching ketersediaan:", error);
    }
  };

  // Group ketersediaan by day
  const ketersediaanByDay = useMemo(() => {
    const days: DaysType[] = ["1", "2", "3", "4", "5"];
    const grouped: { [key in DaysType]: KetersediaanDosen[] } = {
      "1": [],
      "2": [],
      "3": [],
      "4": [],
      "5": [],
    };

    days.forEach((day) => {
      grouped[day] = ketersediaanList
        .filter((k) => k.day_of_week === day)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));
    });

    return grouped;
  }, [ketersediaanList]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSlots = ketersediaanList.length;
    const totalHours = ketersediaanList.reduce((sum, k) => {
      const [startHour, startMin, startSec] = k.start_time
        .split(":")
        .map(Number);
      const [endHour, endMin, endSec] = k.end_time.split(":").map(Number);
      const durationMin = endHour * 60 + endMin - (startHour * 60 + startMin);
      return sum + durationMin / 60;
    }, 0);

    return { totalSlots, totalHours: totalHours.toFixed(1) };
  }, [ketersediaanList]);

  const handleAddNew = () => {
    setSelectedKetersediaan(null);
    setDialogOpen(true);
  };

  const handleEdit = (ketersediaan: KetersediaanDosen) => {
    setSelectedKetersediaan(ketersediaan);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await onDelete(deleteId!);

      if (response.ok) {
        fetchKetersediaan();
      }
    } catch (error) {
      console.error("Error deleting ketersediaan:", error);
    }
  };

  const handleSave = async (
    data: Omit<KetersediaanDosen, "id"> & { id?: number }
  ) => {
    if (data.id) {
      try {
        const response = await onSave(data);
        if (response.ok) {
          fetchKetersediaan();
        }
      } catch (error) {
        console.error("Error updating ketersediaan:", error);
      }
    } else {
      try {
        const response = await onSave(data);
        if (response.ok) {
          fetchKetersediaan();
        }
      } catch (error) {
        console.error("Error saving ketersediaan:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kelola Jadwal Ketersediaan
            </h1>
            <p className="text-gray-600">
              Atur waktu ketersediaan Anda untuk bimbingan mahasiswa
            </p>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Tambah Sesi
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900 font-medium">
              Jadwal ketersediaan ini akan berlaku untuk semua minggu
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Mahasiswa dapat melihat dan memilih slot waktu yang tersedia untuk
              mengajukan jadwal bimbingan
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Slot
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalSlots}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Waktu tersedia</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CalendarClock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Durasi
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalHours} jam
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Per minggu</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">⏱️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Grid by Day */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {(
            Object.entries(ketersediaanByDay) as [
              DaysType,
              KetersediaanDosen[]
            ][]
          ).map(([day, slots]) => (
            <div key={day} className="space-y-4">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-3 rounded-xl shadow-md">
                <h2 className="text-lg font-bold">{getDayName(day)}</h2>
                <p className="text-sm text-blue-100">
                  {slots.length} slot tersedia
                </p>
              </div>

              {/* Schedule Cards */}
              {slots.length > 0 ? (
                <div className="space-y-3">
                  {slots.map((ketersediaan, index) => (
                    <KetersediaanCard
                      key={ketersediaan.id}
                      ketersediaan={ketersediaan}
                      sessionNumber={index + 1}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-2">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarClock className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Belum ada slot</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Tambahkan waktu ketersediaan
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <KetersediaanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        ketersediaanList={ketersediaanList}
        ketersediaan={selectedKetersediaan}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default JadwalPage;
