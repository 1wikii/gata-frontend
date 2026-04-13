import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface PersonalScheduleData {
  name: string;
  date: string;
  time: string;
  supervisor1: string;
  supervisor2: string;
  examiner1: string;
  examiner2: string;
  location: string;
}

const SchedulePersonal = () => {
  // Data jadwal personal mahasiswa
  const scheduleData: PersonalScheduleData = {
    name: "Rafli Hafidz Fadilah",
    date: "09 / 10 / 2025",
    time: "09.00 - 10.00",
    supervisor1: "ANS",
    supervisor2: "HBF",
    examiner1: "LIA",
    examiner2: "MCT",
    location: "link.meet / D214",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2 border-slate-200">
        <CardHeader className="text-center space-y-2 pb-4 pt-8 rounded-t-2xl">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-blue-600 rounded-full shadow-xl">
              <Calendar className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-600">
            Pengumuman Jadwal Sidang
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Nama
              </label>
              <input
                type="text"
                value={scheduleData.name}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Tanggal Sidang */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Tanggal Sidang
              </label>
              <input
                type="text"
                value={scheduleData.date}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Waktu Sidang */}
            <div className="space-y-1">
              <label
                htmlFor="time"
                className="block text-xs font-semibold text-slate-700"
              >
                Waktu Sidang
              </label>
              <input
                id="time"
                type="text"
                value={scheduleData.time}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Lokasi */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Lokasi
              </label>
              <input
                type="text"
                value={scheduleData.location}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Pembimbing 1 */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Pembimbing 1
              </label>
              <input
                type="text"
                value={scheduleData.supervisor1}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Pembimbing 2 */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Pembimbing 2
              </label>
              <input
                type="text"
                value={scheduleData.supervisor2}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Penguji 1 */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Penguji 1
              </label>
              <input
                type="text"
                value={scheduleData.examiner1}
                readOnly
                placeholder="Nama penguji"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Penguji 2 */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Penguji 2
              </label>
              <input
                type="text"
                value={scheduleData.examiner2}
                readOnly
                placeholder="Nama penguji"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePersonal;
