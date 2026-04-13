"use client";

import React from "react";
import { SidangScheduleRow } from "@/utils/sidangScheduleParser";
import SidangScheduleTable from "./SidangScheduleTable";

interface SidangScheduleGroupTableProps {
  schedules: SidangScheduleRow[];
  onEdit?: (schedule: SidangScheduleRow) => void;
  onDelete?: (scheduleId: number) => void;
}

const SidangScheduleGroupTable: React.FC<SidangScheduleGroupTableProps> = ({
  schedules,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {/* Content View */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <SidangScheduleTable
          schedules={schedules}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default SidangScheduleGroupTable;
