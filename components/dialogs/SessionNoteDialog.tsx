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
import { JadwalBimbingan, ActionType } from "@/types/bimbingan";
import { getDayName, DaysType } from "@/utils/dateHelper";
import { Play, CheckCircle, XCircle, UserX } from "lucide-react";

interface SessionNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: JadwalBimbingan | null;
  onSave: (data: { actionType: ActionType; catatan?: string }) => void;
}

const SessionNoteDialog: React.FC<SessionNoteDialogProps> = ({
  open,
  onOpenChange,
  schedule,
  onSave,
}) => {
  const [actionType, setActionType] = useState<ActionType>("mulai");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    if (open) {
      setActionType("mulai");
      setCatatan("");
    }
  }, [open]);

  const handleSave = () => {
    const data: { actionType: ActionType; catatan?: string } = { actionType };

    // Hanya tambahkan catatan jika action adalah selesai atau batalkan
    if (actionType === "selesai" || actionType === "batalkan") {
      data.catatan = catatan;
    }

    onSave(data);
    onOpenChange(false);
  };

  // Check if catatan should be shown
  const showCatatanInput =
    actionType === "selesai" || actionType === "batalkan";

  if (!schedule) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {actionType === "mulai" && (
                <Play className="w-6 h-6 text-blue-600" />
              )}
              {actionType === "selesai" && (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
              {actionType === "batalkan" && (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              {actionType === "tidak_hadir" && (
                <UserX className="w-6 h-6 text-orange-600" />
              )}
            </div>
            <div>
              <AlertDialogTitle className="text-xl">
                Aksi Sesi Bimbingan
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                {getDayName(schedule.day_of_week)}, {schedule.start_time} -{" "}
                {schedule.end_time}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Mahasiswa Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Mahasiswa
            </p>
            <div className="space-y-1">
              {schedule.mahasiswa.map((mhs, index) => (
                <p key={mhs.id} className="text-sm text-gray-700">
                  {index + 1}. {mhs.name} ({mhs.nim})
                </p>
              ))}
            </div>
          </div>

          {/* Action Type Select */}
          {schedule.status === "scheduled" || schedule.status === "ongoing" ? (
            <>
              <div className="space-y-2">
                <Label
                  htmlFor="actionType"
                  className="text-gray-700 font-semibold"
                >
                  Pilih Aksi
                </Label>
                <Select
                  value={actionType}
                  onValueChange={(value: string) =>
                    setActionType(value as ActionType)
                  }
                >
                  <SelectTrigger id="actionType" className="w-full">
                    <SelectValue placeholder="Pilih aksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <>
                      <SelectItem value="mulai">
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4 text-blue-600" />
                          Mulai Sesi
                        </div>
                      </SelectItem>
                      <SelectItem value="selesai">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Selesai
                        </div>
                      </SelectItem>
                      <SelectItem value="batalkan">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Batalkan
                        </div>
                      </SelectItem>
                      <SelectItem value="tidak_hadir">
                        <div className="flex items-center gap-2">
                          <UserX className="w-4 h-4 text-orange-600" />
                          Tidak Hadir
                        </div>
                      </SelectItem>
                    </>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  {actionType === "mulai" && "Tandai sesi bimbingan dimulai"}
                  {actionType === "selesai" &&
                    "Tandai sesi bimbingan selesai dan tambahkan catatan"}
                  {actionType === "batalkan" &&
                    "Batalkan sesi bimbingan dengan alasan"}
                  {actionType === "tidak_hadir" &&
                    "Tandai mahasiswa tidak hadir pada sesi ini"}
                </p>
              </div>
            </>
          ) : null}

          {/* Catatan Textarea - Only show for selesai or batalkan */}
          {showCatatanInput && (
            <div className="space-y-2">
              <Label htmlFor="catatan" className="text-gray-700 font-semibold">
                {actionType === "selesai"
                  ? "Catatan Sesi"
                  : "Alasan Pembatalan"}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <textarea
                id="catatan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder={
                  actionType === "selesai"
                    ? "Tuliskan catatan atau progress dari sesi bimbingan ini..."
                    : "Tuliskan alasan pembatalan sesi bimbingan..."
                }
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                rows={5}
              />
              <p className="text-xs text-gray-500">{catatan.length} karakter</p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          {(schedule.status === "scheduled" ||
            schedule.status === "ongoing") && (
            <AlertDialogAction
              onClick={handleSave}
              disabled={showCatatanInput && !catatan.trim()}
            >
              {actionType === "mulai" && "Mulai Sesi"}
              {actionType === "selesai" && "Selesai & Simpan"}
              {actionType === "batalkan" && "Batalkan Sesi"}
              {actionType === "tidak_hadir" && "Tandai Tidak Hadir"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionNoteDialog;
