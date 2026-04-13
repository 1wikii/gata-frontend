"use client";

import React, { FC, useState } from "react";
import { Plus, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

interface Props {
  validationData: {
    remaining_quota_sup1: number;
    remaining_quota_sup2: number;
    max_quota_sup1: number;
    max_quota_sup2: number;
    filled_quota_sup1: number;
    filled_quota_sup2: number;
  };
  onAddSlot: (data: {
    supervisorType: "1" | "2";
    amount: number;
  }) => Promise<any>;
}

const KuotaBimbinganCard: FC<Props> = ({ validationData, onAddSlot }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [supervisorType, setSupervisorType] = useState<"1" | "2">("1");
  const [slotAmount, setSlotAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleOpenDialog = (type: "1" | "2") => {
    setSupervisorType(type);
    setSlotAmount("");
    setError("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSlotAmount("");
    setError("");
  };

  const handleInputChange = (value: string) => {
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setSlotAmount(value);
      setError("");
    }
  };

  const handleSubmit = async () => {
    const amount = parseInt(slotAmount);

    // Validation
    if (!slotAmount || slotAmount === "0") {
      setError("Jumlah slot tidak boleh kosong atau nol");
      return;
    }

    if (amount <= 0) {
      setError("Jumlah slot harus lebih dari 0");
      return;
    }

    if (amount > 50) {
      setError("Jumlah slot maksimal 50");
      return;
    }

    // Call API to add slot
    try {
      const response = await onAddSlot({ supervisorType, amount });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding slot:", error);
    }

    // Close dialog
    handleCloseDialog();
  };

  const getSupervisorTitle = () => {
    return supervisorType === "1" ? "Pembimbing 1" : "Pembimbing 2";
  };

  return (
    <>
      {/* Dialog untuk Tambah Slot */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-between mb-2">
              <AlertDialogTitle className="text-xl font-bold text-gray-900">
                Tambah Slot {getSupervisorTitle()}
              </AlertDialogTitle>
              <button
                onClick={handleCloseDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </AlertDialogHeader>

          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Slot yang Akan Ditambahkan
            </label>
            <input
              type="text"
              value={slotAmount}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Masukkan jumlah slot"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                error
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="font-medium">⚠</span> {error}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Masukkan angka antara 1-50 slot
            </p>
          </div>

          <AlertDialogFooter className="flex gap-3">
            <button
              onClick={handleCloseDialog}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Tambah Slot
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <div className="content-section w-full">
        <h2 className="text-xl font-semibold text-primary mb-6">
          Ringkasan Kuota Pembimbing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pembimbing 1 Card */}
          <div className="content-section relative">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-blue-600">Pembimbing 1</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Sisa: {validationData.remaining_quota_sup1} slot
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Kuota:</span>
                <span className="font-medium">
                  {validationData.max_quota_sup1}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Terisi:</span>
                <span className="font-medium">
                  {validationData.filled_quota_sup1}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (validationData.filled_quota_sup1 /
                        validationData.max_quota_sup1) *
                      100
                    }%`,
                  }}
                ></div>
              </div>

              {/* Tombol Tambah Slot Pembimbing 1 */}
              <button
                onClick={() => handleOpenDialog("1")}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Plus size={18} />
                Tambah Slot
              </button>
            </div>
          </div>

          {/* Pembimbing 2 Card */}
          <div className="content-section relative">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-blue-600">Pembimbing 2</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Sisa: {validationData.remaining_quota_sup2} slot
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Kuota:</span>
                <span className="font-medium">
                  {validationData.max_quota_sup2}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Terisi:</span>
                <span className="font-medium">
                  {validationData.filled_quota_sup2}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (validationData.filled_quota_sup2 /
                        validationData.max_quota_sup2) *
                      100
                    }%`,
                  }}
                ></div>
              </div>

              {/* Tombol Tambah Slot Pembimbing 2 */}
              <button
                onClick={() => handleOpenDialog("2")}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Plus size={18} />
                Tambah Slot
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KuotaBimbinganCard;
