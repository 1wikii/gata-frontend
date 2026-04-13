"use client";

import ContainerTitleDosen from "@/components/cards/ContainerTitle";
import JadwalCard from "./JadwalCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GetCurrentRoute from "@/utils/GetCurrentRoute";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

const JadwalPage: React.FC<{}> = ({}) => {
  return (
    <div className="flex flex-col gap-y-4">
      <ContainerTitleDosen
        title="Kelola Jadwal"
        className="flex justify-between items-center"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary text-white px-4 flex items-center gap-x-2">
              Tambah Jadwal
              <div className="w-px h-full bg-secondary"></div>
              <FaChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem>
              <a href={`${GetCurrentRoute()}/sidang`} className="w-full">
                Sidang
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href={`${GetCurrentRoute()}/bimbingan`} className="w-full">
                Bimbingan
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ContainerTitleDosen>
      <div className="flex flex-col gap-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <JadwalCard
            key={index}
            type="Sidang"
            date="15 Jan 2025"
            timeRange="10:00 - 12:00"
            desc="Pengajuan 2025"
          />
        ))}
      </div>
    </div>
  );
};

export default JadwalPage;
