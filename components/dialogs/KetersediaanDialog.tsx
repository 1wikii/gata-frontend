"use client";

import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { KetersediaanDosen } from "@/types/ketersediaan";
import { getDayName, DaysType } from "@/utils/dateHelper";

interface KetersediaanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ketersediaanList: KetersediaanDosen[];
  ketersediaan?: KetersediaanDosen | null;
  onSave: (data: Omit<KetersediaanDosen, "id"> & { id?: number }) => void;
}

const HARI_OPTIONS: DaysType[] = ["1", "2", "3", "4", "5"];

const KetersediaanDialog: React.FC<KetersediaanDialogProps> = ({
  open,
  onOpenChange,
  ketersediaanList,
  ketersediaan,
  onSave,
}) => {
  const [day_of_week, setDayOfWeek] = useState<DaysType>("1");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<{
    start_time?: string;
    end_time?: string;
    location?: string;
  }>({});

  // Reset form when dialog opens/closes or ketersediaan changes
  useEffect(() => {
    if (ketersediaan) {
      setDayOfWeek(ketersediaan.day_of_week);
      setStartTime(ketersediaan.start_time);
      setEndTime(ketersediaan.end_time);
    } else {
      setDayOfWeek("1");
      setStartTime("");
      setEndTime("");
    }
    setErrors({});
  }, [ketersediaan, open]);

  const validateForm = () => {
    const newErrors: {
      start_time?: string;
      end_time?: string;
      location?: string;
    } = {};

    if (!start_time) {
      newErrors.start_time = "Waktu mulai harus diisi";
    }

    if (!end_time) {
      newErrors.end_time = "Waktu selesai harus diisi";
    }
    if (!location) {
      newErrors.location = "Lokasi harus diisi";
    }

    if (start_time && end_time) {
      const [startHour, startMin, startSec] = start_time.split(":").map(Number);
      const [endHour, endMin, endSec] = end_time.split(":").map(Number);
      const startTotal = startHour * 60 + startMin;
      const endTotal = endHour * 60 + endMin;

      if (startTotal >= endTotal) {
        newErrors.end_time = "Waktu selesai harus lebih besar dari waktu mulai";
      }

      // Validasi overlap dengan jadwal yang sudah ada
      if (!newErrors.end_time) {
        const existingSchedules = ketersediaanList.filter(
          (item) =>
            item.day_of_week === day_of_week &&
            (!ketersediaan || item.id !== ketersediaan.id) // Exclude current item when editing
        );

        for (const schedule of existingSchedules) {
          const [existingStartHour, existingStartMin] = schedule.start_time
            .split(":")
            .map(Number);
          const [existingEndHour, existingEndMin] = schedule.end_time
            .split(":")
            .map(Number);
          const existingStartTotal = existingStartHour * 60 + existingStartMin;
          const existingEndTotal = existingEndHour * 60 + existingEndMin;

          // Check if there's any overlap
          // New schedule overlaps if:
          // 1. New start is before existing end AND new end is after existing start
          const hasOverlap =
            startTotal < existingEndTotal && endTotal > existingStartTotal;

          if (hasOverlap) {
            newErrors.end_time = `Jadwal bertumpuk dengan sesi ${schedule.start_time.slice(
              0,
              5
            )} - ${schedule.end_time.slice(0, 5)}`;
            break;
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...(ketersediaan && { id: ketersediaan.id }),
        day_of_week,
        start_time,
        end_time,
        location,
      });
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="fixed !top-[15%] left-1/2 -translate-x-1/2 !translate-y-0 
             max-w-3xl w-full max-h-[70vh] overflow-y-auto rounded-lg p-6 shadow-lg"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            {ketersediaan ? "Edit Sesi" : "Tambah Sesi"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Atur sesi untuk bimbingan mahasiswa
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Hari Select */}
          <div className="space-y-2">
            <Label
              htmlFor="day_of_week"
              className="text-gray-700 font-semibold"
            >
              Hari
            </Label>
            <Select
              value={day_of_week}
              onValueChange={(value: string) => setDayOfWeek(value as DaysType)}
            >
              <SelectTrigger id="day_of_week" className="w-full">
                <SelectValue placeholder="Pilih hari" />
              </SelectTrigger>
              <SelectContent>
                {HARI_OPTIONS.map((h) => (
                  <SelectItem key={h} value={h}>
                    {getDayName(h)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jam Mulai */}
          <div className="space-y-2">
            <Label htmlFor="start_time" className="text-gray-700 font-semibold">
              Waktu Mulai
            </Label>
            <Input
              id="start_time"
              type="time"
              value={start_time}
              onChange={(e) => setStartTime(e.target.value)}
              className={errors.start_time ? "border-red-500" : ""}
            />
            {errors.start_time && (
              <p className="text-xs text-red-600 mt-1">{errors.start_time}</p>
            )}
          </div>

          {/* Jam Selesai */}
          <div className="space-y-2">
            <Label htmlFor="end_time" className="text-gray-700 font-semibold">
              Waktu Selesai
            </Label>
            <Input
              id="end_time"
              type="time"
              value={end_time}
              onChange={(e) => setEndTime(e.target.value)}
              className={errors.end_time ? "border-red-500" : ""}
            />
            {errors.end_time && (
              <p className="text-xs text-red-600 mt-1">{errors.end_time}</p>
            )}
          </div>

          {/* Duration Preview */}
          {start_time && end_time && !errors.end_time && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 font-medium">
                Durasi:{" "}
                {(() => {
                  const [startHour, startMin, startSec] = start_time
                    .split(":")
                    .map(Number);
                  const [endHour, endMin, endSec] = end_time
                    .split(":")
                    .map(Number);
                  const durationMin =
                    endHour * 60 + endMin - (startHour * 60 + startMin);
                  const hours = Math.floor(durationMin / 60);
                  const mins = durationMin % 60;
                  return hours > 0
                    ? `${hours} jam ${mins > 0 ? mins + " menit" : ""}`
                    : `${mins} menit`;
                })()}
              </p>
            </div>
          )}

          {/* Lokasi */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-700 font-semibold">
              Lokasi <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <Input
                id="location"
                type="text"
                placeholder="Contoh: Ruang Lab 401, Gedung A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`pl-10 ${
                  errors.location
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.location && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.location}
              </p>
            )}
            {!errors.location && location && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Lokasi valid
              </p>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Prevent default behavior to avoid closing the dialog
              handleSave();
            }}
          >
            {ketersediaan ? "Simpan Perubahan" : "Tambah"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default KetersediaanDialog;
