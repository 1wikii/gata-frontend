"use client";

import React, { useState, useMemo, useEffect } from "react";
import ScheduleCard from "@/components/cards/ScheduleCard";
import SessionNoteDialog from "@/components/dialogs/SessionNoteDialog";
import { JadwalBimbingan, ActionType } from "@/types/bimbingan";
import { getDayName, DaysType } from "@/utils/dateHelper";
import { Card, CardContent } from "@/components/ui/card";

import { Calendar, Settings } from "lucide-react";

// Mock data - replace with actual API call
// const mockSchedules = [
//   {
//     id: 1,
//     day_of_week: "1",
//     session_date: "2025-11-03",
//     start_time: "09:00",
//     end_time: "11:00",
//     tipeTA: "regular",
//     status: "completed",
//     location: "Lab Komputer A",
//     topic: "Pembahasan BAB I dan Metodologi Penelitian",
//     mahasiswa: [
//       { id: 1, name: "Ahmad Fauzi", nim: "2021001" },
//       { id: 2, name: "Siti Nurhaliza", nim: "2021002" },
//     ],
//     student_notes:
//       "Mahasiswa sudah menyelesaikan BAB I dengan baik. Perlu revisi minor pada bagian metodologi penelitian. Target minggu depan: menyelesaikan revisi dan mulai BAB II.",
//     draftLinks: [
//       {
//         id: 1,
//         name: "BAB_I_Pendahuluan_Rev3.pdf",
//         url: "https://drive.google.com/file/d/1abc123def456/view",
//         uploaded_at: "2025-11-02T14:30:00",
//       },
//       {
//         id: 2,
//         name: "BAB_II_Tinjauan_Pustaka_Draft.pdf",
//         url: "https://drive.google.com/file/d/1xyz789ghi012/view",
//         uploaded_at: "2025-11-03T08:15:00",
//       },
//     ],
//   },
//   {
//     id: 2,
//     day_of_week: "1",
//     session_date: "2025-11-03",
//     start_time: "13:00",
//     end_time: "15:00",
//     tipeTA: "capstone",
//     status: "ongoing",
//     location: "Ruang Project",
//     topic: "Review Sprint 2 dan Planning Sprint 3",
//     mahasiswa: [
//       { id: 3, name: "Budi Santoso", nim: "2021003" },
//       { id: 4, name: "Dewi Lestari", nim: "2021004" },
//       { id: 5, name: "Eko Prasetyo", nim: "2021005" },
//     ],
//     draftLinks: [
//       {
//         id: 3,
//         name: "Sprint_2_Documentation.pdf",
//         url: "https://drive.google.com/file/d/2abc456def789/view",
//         uploaded_at: "2025-11-03T12:45:00",
//       },
//       {
//         id: 4,
//         name: "Technical_Specification_v2.pdf",
//         url: "https://drive.google.com/file/d/2xyz123ghi456/view",
//         uploaded_at: "2025-11-03T11:20:00",
//       },
//       {
//         id: 5,
//         name: "User_Manual_Draft.pdf",
//         url: "https://drive.google.com/file/d/2def789abc012/view",
//         uploaded_at: "2025-11-02T16:30:00",
//       },
//     ],
//   },
// ];

interface Props {
  getData: () => Promise<any>;
  onAction: (data: Partial<JadwalBimbingan>) => Promise<any>;
}

const BimbinganPage: React.FC<Props> = ({ getData, onAction }) => {
  const [schedules, setSchedules] = useState<JadwalBimbingan[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<JadwalBimbingan | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await getData();
    if (response.ok) {
      const data = await response.json();
      setSchedules(data.data);
    }
  };

  // Get current week's date range
  const getWeekRange = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Adjust to Monday

    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    return {
      start: monday,
      end: friday,
      display: `${monday.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      })} - ${friday.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
    };
  };

  const weekRange = getWeekRange();

  // Group schedules by day
  const schedulesByDay = useMemo(() => {
    const days: DaysType[] = ["1", "2", "3", "4", "5"];
    const grouped: { [key: string]: JadwalBimbingan[] } = {};

    days.forEach((day) => {
      grouped[day] = schedules
        .filter((schedule) => schedule.day_of_week === day)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));
    });

    return grouped;
  }, [schedules]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSessions = schedules.length;
    const totalStudents = schedules.reduce(
      (sum, schedule) => sum + schedule.mahasiswa.length,
      0
    );
    const regulerCount = schedules.filter((s) => s.tipeTA === "regular").length;
    const capstoneCount = schedules.filter(
      (s) => s.tipeTA === "capstone"
    ).length;

    return { totalSessions, totalStudents, regulerCount, capstoneCount };
  }, [schedules]);

  const handleScheduleClick = (
    schedule: JadwalBimbingan,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent card click
    setSelectedSchedule(schedule);
    setDialogOpen(true);
  };

  const handleAction = async (dialogData: {
    actionType: ActionType;
    catatan?: string;
  }) => {
    if (selectedSchedule) {
      let data: Partial<JadwalBimbingan> = {};

      switch (dialogData.actionType) {
        case "mulai":
          data = {
            status: "ongoing",
          };
          break;
        case "selesai":
          data = {
            status: "completed",
            lecturer_feedback: dialogData.catatan,
          };
          break;
        case "batalkan":
          data = {
            status: "cancelled",
            lecturer_feedback: dialogData.catatan,
          };
          break;
        case "tidak_hadir":
          data = {
            status: "no_show",
          };
          break;
      }

      data.id = selectedSchedule.id;

      try {
        const response = await onAction(data);
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error("Error performing action:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Jadwal Bimbingan Tugas Akhir
            </h1>
            <p className="text-gray-600">
              Kelola dan pantau jadwal bimbingan mahasiswa Anda
            </p>
          </div>

          {/* Kelola Jadwal Button */}
          <a
            href={`/dosen/bimbingan/jadwal`}
            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <Settings className="w-5 h-5" />
            Kelola Jadwal
          </a>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Sesi
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalSessions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Mahasiswa */}
          <a href="/dosen/bimbingan/total-mahasiswa">
            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg hover:border-l-orange-600 transition-all duration-200 cursor-pointer h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Mahasiswa
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.totalStudents}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>

          <Card className="border-l-4 border-l-blue-400">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    TA Reguler
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.regulerCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-700">REG</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    TA Capstone
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.capstoneCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-700">CAP</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Week Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-gray-700">
              Minggu Ini:
            </span>
            <span className="text-sm text-gray-600">{weekRange.display}</span>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(schedulesByDay).map(([day, schedules]) => (
            <div key={day} className="space-y-4">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-3 rounded-xl shadow-md">
                <h2 className="text-lg font-bold">
                  {getDayName(day as DaysType)}
                </h2>
                <p className="text-sm text-blue-100">
                  {schedules.length} sesi bimbingan
                </p>
              </div>

              {/* Schedule Cards */}
              {schedules.length > 0 ? (
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <ScheduleCard
                      key={schedule.id}
                      schedule={schedule}
                      onActionClick={(e) => handleScheduleClick(schedule, e)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-2">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      Tidak ada jadwal
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Hari ini tidak ada sesi bimbingan
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Session Note Dialog */}
      <SessionNoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        schedule={selectedSchedule}
        onSave={handleAction}
      />
    </div>
  );
};

export default BimbinganPage;
