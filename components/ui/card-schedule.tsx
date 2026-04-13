"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Clock,
  User,
  Loader,
  AlertCircle,
} from "lucide-react";
import { api } from "@/utils/api";

export interface SidangScheduleRow {
  nim: string;
  name: string;
  judul: string;
  capstone_code: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  spv_1: string;
  spv_2: string;
  examiner_1: string;
  examiner_2: string;
  status: string;
  location: string;
}

const TugasAkhirSchedule = () => {
  const [displaySchedules, setDisplaySchedules] = useState<SidangScheduleRow[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch data dari API jika useApi = true
  useEffect(() => {
    const loadSchedules = async () => {
      setIsLoading(true);
      try {
        setError(null);
        const response = await api.get("/jadwal-sidang");
        const result = await response.json();

        if (response.ok) {
          setDisplaySchedules(result.data);
        }
      } catch (err) {
        console.error("Error loading schedules:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat memuat jadwal sidang"
        );
        setDisplaySchedules([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, []);

  // Find the current Monday or next Monday to start the week
  const getStartOfWeek = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);

    if (currentDay === 0) {
      monday.setDate(today.getDate() + 1);
    } else if (currentDay === 1) {
      // Already Monday
    } else {
      const daysFromMonday = currentDay - 1;
      monday.setDate(today.getDate() - daysFromMonday);
    }

    return monday;
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek());
  const [selectedSchedule, setSelectedSchedule] =
    useState<SidangScheduleRow | null>(null);

  // Generate weekdays only (Monday-Friday) for the next 35 working days
  const generateDates = (startDate: Date) => {
    const dates = [];
    let currentDate = new Date(startDate);
    let daysAdded = 0;

    while (daysAdded < 35) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Only add if it's a weekday (Monday = 1 to Friday = 5)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        dates.push(new Date(currentDate));
        daysAdded++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const allDates = useMemo(() => generateDates(new Date()), []);

  // Get today's date for validation
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const formatDateString = (date: Date) => {
    // Format date as YYYY-MM-DD using local time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get visible dates based on current week (Monday-Friday only)
  const visibleDates = useMemo(() => {
    const currentWeekStartString = formatDateString(currentWeekStart);

    const startIndex = allDates.findIndex(
      (date) => formatDateString(date) === currentWeekStartString
    );

    if (startIndex === -1) {
      // If current week start is not found, return the first 5 weekdays
      return allDates.slice(0, 5);
    }

    // Get up to 5 weekdays starting from the current week start
    // But allow displaying fewer days if that's all that's available
    const endIndex = Math.min(startIndex + 5, allDates.length);
    const dates = allDates.slice(startIndex, endIndex);

    // Return available dates, even if less than 5 days
    return dates.length > 0
      ? dates
      : allDates.slice(0, Math.min(5, allDates.length));
  }, [currentWeekStart, allDates]);

  const formatDate = (date: Date) => {
    const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const days = ["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", ""]; // Index matches getDay()
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    // Only return valid weekday names, fallback to empty string for weekends
    const dayName = days[dayIndex] || "";

    return {
      day: dayName.toUpperCase(),
      date: date.getDate(),
      month: months[date.getMonth()].toUpperCase(),
    };
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7); // Move to previous week

    // Find the previous Monday if the new date is not a Monday
    while (newDate.getDay() !== 1) {
      newDate.setDate(newDate.getDate() - 1);
    }

    const today = getTodayDate();

    // Normalize newDate for comparison
    const normalizedNewDate = new Date(newDate);
    normalizedNewDate.setHours(0, 0, 0, 0);

    const fourDayInMS = 4 * 24 * 60 * 60 * 1000;

    // Don't allow going before today
    if (
      normalizedNewDate.getTime() >= today.getTime() ||
      today.getTime() - normalizedNewDate.getTime() <= fourDayInMS
    ) {
      setCurrentWeekStart(newDate);
    }
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7); // Move to next week

    // Find the next Monday if the new date is not a Monday
    while (newDate.getDay() !== 1) {
      newDate.setDate(newDate.getDate() + 1);
    }

    // Calculate max date (35 days from today)
    const maxDate = new Date();
    maxDate.setHours(0, 0, 0, 0);
    maxDate.setDate(maxDate.getDate() + 35);

    // Normalize newDate for comparison
    const normalizedNewDate = new Date(newDate);
    normalizedNewDate.setHours(0, 0, 0, 0);

    // Check if the new week start date is within bounds
    if (normalizedNewDate.getTime() <= maxDate.getTime()) {
      // Check if we have at least one weekday available from the new start
      const newDateString = formatDateString(newDate);
      const newStartIndex = allDates.findIndex(
        (date) => formatDateString(date) === newDateString
      );

      // Allow navigation if we have at least one weekday available
      if (newStartIndex !== -1 && newStartIndex < allDates.length) {
        setCurrentWeekStart(newDate);
      }
    }
  };

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  // Parse date string from "Senin, 18 September 2025" to Date
  const parseDateString = (dateStr: string): Date | null => {
    try {
      // Try parsing if it's already in ISO format (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split("-").map(Number);
        // Create date in local timezone, not UTC
        const date = new Date(year, month - 1, day);
        date.setHours(0, 0, 0, 0);
        return date;
      }

      // If it's in Indonesian format, parse it
      const months: { [key: string]: number } = {
        Januari: 0,
        Februari: 1,
        Maret: 2,
        April: 3,
        Mei: 4,
        Juni: 5,
        Juli: 6,
        Agustus: 7,
        September: 8,
        Oktober: 9,
        November: 10,
        Desember: 11,
      };

      const parts = dateStr.split(",")[1]?.trim().split(" ");
      if (parts && parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = months[parts[1]];
        const year = parseInt(parts[2]);
        // Create date in local timezone
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        return date;
      }

      return null;
    } catch {
      return null;
    }
  };

  const handleCardClick = (schedule: SidangScheduleRow) => {
    setSelectedSchedule(schedule);
  };

  const getDateRangeText = () => {
    if (!visibleDates || visibleDates.length === 0) {
      return "No dates available";
    }

    const start = visibleDates[0];
    const end = visibleDates[visibleDates.length - 1];

    if (!start || !end) {
      return "Invalid date range";
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    return `${start.getDate()} ${
      months[start.getMonth()]
    }  ${` - `} ${end.getDate()} ${months[end.getMonth()]}`;
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Memuat jadwal sidang...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">
                Gagal Memuat Jadwal
              </h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && displaySchedules.length === 0 && (
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum Ada Jadwal
            </h3>
            <p className="text-gray-600">
              Jadwal sidang akan ditampilkan di sini setelah dijadwalkan.
            </p>
          </div>
        )}

        {/* Calendar Content */}
        {!isLoading && !error && displaySchedules.length > 0 && (
          <>
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-lg mb-6 flex items-center justify-center gap-4">
              <button
                onClick={handlePrevWeek}
                className="p-2 hover:bg-blue-700 rounded-lg transition cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="text-lg font-medium">{getDateRangeText()}</span>
              <button
                onClick={handleNextWeek}
                className="p-2 hover:bg-blue-700 rounded-lg transition cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Daily Schedule List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleDates.map((date, dateIdx) => {
                const formatted = formatDate(date);
                const dateString = formatDateString(date);

                // Get all schedules for this date
                const daySchedules = displaySchedules
                  .filter((s) => {
                    const scheduleDate = parseDateString(s.date);
                    const scheduleDateString = scheduleDate
                      ? formatDateString(scheduleDate)
                      : s.date;
                    return scheduleDateString === dateString;
                  })
                  .sort((a, b) => {
                    // Sort by start time
                    const [aHour, aMin] = a.startTime.split(":").map(Number);
                    const [bHour, bMin] = b.startTime.split(":").map(Number);
                    return aHour * 60 + aMin - (bHour * 60 + bMin);
                  });

                const dayNames = [
                  "Minggu",
                  "Senin",
                  "Selasa",
                  "Rabu",
                  "Kamis",
                  "Jumat",
                  "Sabtu",
                ];
                const dayName = dayNames[date.getDay()];

                return (
                  <div
                    key={dateIdx}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {/* Day Header */}
                    <div className="bg-blue-600 text-white p-4">
                      <h3 className="text-lg font-semibold">{dayName}</h3>
                      <p className="text-sm opacity-90">
                        {formatted.date} {formatted.month}
                      </p>
                      <p className="text-xs mt-1">
                        {daySchedules.length} Jadwal
                      </p>
                    </div>

                    {/* Schedule List */}
                    <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                      {daySchedules.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Belum ada jadwal</p>
                        </div>
                      ) : (
                        daySchedules.map((schedule, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleCardClick(schedule)}
                            className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-3 cursor-pointer hover:shadow-md transition"
                          >
                            {/* Session Header */}
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                                <Clock size={14} />
                                <span>
                                  {schedule.startTime} - {schedule.endTime}
                                </span>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded font-medium ${
                                  schedule.type
                                    .toLowerCase()
                                    .includes("proposal")
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {schedule.type === "proposal"
                                  ? "Proposal"
                                  : "Sidang"}
                              </span>
                            </div>

                            {/* Student Info */}
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">
                              {schedule.name}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                              <User size={12} />
                              {schedule.nim}
                            </p>

                            {/* Location */}
                            {schedule.location && (
                              <div className="flex items-center gap-1 text-xs text-gray-700 mb-2">
                                <MapPin size={12} className="text-blue-600" />
                                <span className="font-medium">
                                  {schedule.location}
                                </span>
                              </div>
                            )}

                            {/* Supervisors */}
                            <div className="mb-2">
                              <p className="text-xs text-gray-600 mb-1">
                                Pembimbing:
                              </p>
                              <div className="flex gap-1 flex-wrap">
                                {schedule.spv_1 && (
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                    {schedule.spv_1}
                                  </span>
                                )}
                                {schedule.spv_2 && (
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                    {schedule.spv_2}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Examiners */}
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Penguji:
                              </p>
                              <div className="flex gap-1 flex-wrap">
                                {schedule.examiner_1 && (
                                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">
                                    {schedule.examiner_1}
                                  </span>
                                )}
                                {schedule.examiner_2 && (
                                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">
                                    {schedule.examiner_2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {selectedSchedule && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSchedule(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-xl font-semibold">
                Detail Sidang Tugas Akhir
              </h2>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="hover:bg-blue-700 rounded p-1 transition cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedSchedule.name}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <User size={16} />
                    <span className="font-mono">{selectedSchedule.nim}</span>
                  </p>
                </div>
                <span
                  className={`text-sm px-3 py-1.5 rounded font-semibold flex-shrink-0 ${
                    selectedSchedule.type.toLowerCase().includes("proposal")
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {selectedSchedule.type === "proposal" ? "Proposal" : "Sidang"}
                </span>
              </div>

              {/* Judul */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Judul Tugas Akhir
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedSchedule.judul || "-"}
                </p>
              </div>

              {/* Jadwal dan Lokasi */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-1">
                    <Clock size={16} />
                    WAKTU
                  </h4>
                  <p className="text-gray-800 font-medium">
                    {selectedSchedule.startTime} - {selectedSchedule.endTime}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-sm font-semibold text-green-700 mb-2">
                    TANGGAL
                  </h4>
                  <p className="text-gray-800 font-medium">
                    {selectedSchedule.date}
                  </p>
                </div>
                {selectedSchedule.location && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-1">
                      <MapPin size={16} />
                      LOKASI
                    </h4>
                    <p className="text-gray-800 font-medium">
                      {selectedSchedule.location}
                    </p>
                  </div>
                )}
              </div>

              {/* Pembimbing */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Dosen Pembimbing
                </h4>
                <div className="flex flex-col gap-2">
                  {selectedSchedule.spv_1 && (
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                      <span className="font-semibold text-blue-800 text-sm">
                        Pembimbing 1:
                      </span>
                      <span className="text-gray-800">
                        {selectedSchedule.spv_1}
                      </span>
                    </div>
                  )}
                  {selectedSchedule.spv_2 && (
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                      <span className="font-semibold text-blue-800 text-sm">
                        Pembimbing 2:
                      </span>
                      <span className="text-gray-800">
                        {selectedSchedule.spv_2}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Penguji */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Dosen Penguji
                </h4>
                <div className="flex flex-col gap-2">
                  {selectedSchedule.examiner_1 && (
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-3 rounded-lg border border-amber-200">
                      <span className="font-semibold text-amber-800 text-sm">
                        Penguji 1:
                      </span>
                      <span className="text-gray-800">
                        {selectedSchedule.examiner_1}
                      </span>
                    </div>
                  )}
                  {selectedSchedule.examiner_2 && (
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-3 rounded-lg border border-amber-200">
                      <span className="font-semibold text-amber-800 text-sm">
                        Penguji 2:
                      </span>
                      <span className="text-gray-800">
                        {selectedSchedule.examiner_2}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TugasAkhirSchedule;
