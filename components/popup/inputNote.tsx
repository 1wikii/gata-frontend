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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
}

const InputNote: React.FC<Props> = ({ title, isOpen, onClose, onConfirm }) => {
  const [note, setNote] = useState("");

  // Reset note when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setNote("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(note);
    setNote("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>

        {/* Textarea Input */}
        <div className="py-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Masukkan catatan..."
            className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={5}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Ya</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InputNote;
