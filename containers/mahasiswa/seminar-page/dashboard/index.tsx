"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/ui/pagination';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface SeminarData {
  id: string;
  name: string;
  nim: string;
  status: string;
  title: string;
  date: string;
  time: string;
  supervisors: string[];
  examiners: string[];
  location: string;
  room: string;
}

const SeminarRegistration = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Data lengkap (simulasi 8 data)
  const allSeminarData: SeminarData[] = [
    {
      id: '1',
      name: 'Ahmad Rizki Pratama',
      nim: '121140001',
      status: 'Reguler / Proposal',
      title: 'Aplikasi Mobile E-Commerce dengan Fitur Augmented Reality',
      date: '20 - 10 - 2025',
      time: '09.00-10.00',
      supervisors: ['ANS', 'HBF'],
      examiners: ['LIA', 'MCT'],
      location: 'D214',
      room: 'Meet link'
    },
    {
      id: '2',
      name: 'Ahmad Rizki Pratama',
      nim: '121140001',
      status: 'Reguler / Proposal',
      title: 'Aplikasi Mobile E-Commerce dengan Fitur Augmented Reality',
      date: '20 - 10 - 2025',
      time: '09.00-10.00',
      supervisors: ['ANS', 'HBF'],
      examiners: ['LIA', 'MCT'],
      location: 'D214',
      room: 'Meet link'
    },
    {
      id: '3',
      name: 'Ahmad Rizki Pratama',
      nim: '121140001',
      status: 'Reguler / Proposal',
      title: 'Aplikasi Mobile E-Commerce dengan Fitur Augmented Reality',
      date: '20 - 10 - 2025',
      time: '09.00-10.00',
      supervisors: ['ANS', 'HBF'],
      examiners: ['LIA', 'MCT'],
      location: 'D214',
      room: 'Meet link'
    },
    {
      id: '4',
      name: 'Ahmad Rizki Pratama',
      nim: '121140001',
      status: 'Reguler / Proposal',
      title: 'Aplikasi Mobile E-Commerce dengan Fitur Augmented Reality',
      date: '20 - 10 - 2025',
      time: '09.00-10.00',
      supervisors: ['ANS', 'HBF'],
      examiners: ['LIA', 'MCT'],
      location: 'D214',
      room: 'Meet link'
    },
    {
      id: '5',
      name: 'Ahmad Rizki Pratama',
      nim: '121140001',
      status: 'Reguler / Proposal',
      title: 'Aplikasi Mobile E-Commerce dengan Fitur Augmented Reality',
      date: '20 - 10 - 2025',
      time: '09.00-10.00',
      supervisors: ['ANS', 'HBF'],
      examiners: ['LIA', 'MCT'],
      location: 'D214',
      room: 'Meet link'
    },
    {
      id: '6',
      name: 'Siti Nurhaliza',
      nim: '121140002',
      status: 'Reguler / Akhir',
      title: 'Sistem Informasi Manajemen Perpustakaan Berbasis Web',
      date: '21 - 10 - 2025',
      time: '10.00-11.00',
      supervisors: ['LIA', 'MCT'],
      examiners: ['ANS', 'HBF'],
      location: 'D215',
      room: 'Meet link'
    },
    {
      id: '7',
      name: 'Budi Santoso',
      nim: '121140003',
      status: 'Reguler / Proposal',
      title: 'Aplikasi Pembelajaran Bahasa Inggris Berbasis AI',
      date: '22 - 10 - 2025',
      time: '11.00-12.00',
      supervisors: ['HBF', 'LIA'],
      examiners: ['MCT', 'ANS'],
      location: 'D214',
      room: 'Meet link'
    },
    {
      id: '8',
      name: 'Dewi Lestari',
      nim: '121140004',
      status: 'Reguler / Akhir',
      title: 'Platform Crowdfunding untuk UMKM Indonesia',
      date: '23 - 10 - 2025',
      time: '13.00-14.00',
      supervisors: ['MCT', 'ANS'],
      examiners: ['HBF', 'LIA'],
      location: 'D216',
      room: 'Meet link'
    },
  ];

  // Hitung pagination
  const totalItems = allSeminarData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = allSeminarData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Registration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Proposal Card */}
          <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-blue-200 bg-white">
            <CardHeader className="text-center space-y-4 pb-6">
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                UDAH SIAP SEMINAR PROPOSAL? AYO DAFTAR
              </CardTitle>
              <CardDescription className="text-base font-medium text-slate-700">
                PENDAFTARAN SIDANG DIBUKA SETIAP TANGGAL 6 - 5 Bulan Depan
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Button 
                size="lg" 
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Daftar
              </Button>
            </CardContent>
          </Card>

          {/* Final Card */}
          <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-blue-200 bg-white">
            <CardHeader className="text-center space-y-4 pb-6">
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                UDAH SIAP SEMINAR AKHIR? AYO DAFTAR
              </CardTitle>
              <CardDescription className="text-base font-medium text-slate-700">
                PENDAFTARAN SIDANG DIBUKA SETIAP TANGGAL 6 - 5 Bulan Depan
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Button 
                size="lg" 
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Daftar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Button */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-16 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            KLIK SINI UNTUK LIHAT JADWAL KAMU !
          </Button>
        </div>

        {/* Schedule Table */}
        <div className="shadow-xl rounded-lg overflow-hidden">
          <div className="bg-white border border-gray-200 rounded-t-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-slate-700 text-sm">Nama</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-700 text-sm">Judul</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-700 text-sm">Tanggal</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-700 text-sm">Pembimbing</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-700 text-sm">Penguji</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-700 text-sm">Lokasi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.nim} / {item.status}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-slate-800 text-sm line-clamp-2">{item.title}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="font-medium text-sm">{item.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-xs">{item.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.supervisors.map((p, i) => (
                            <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.examiners.map((p, i) => (
                            <Badge key={i} variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-700">
                            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span className="font-semibold text-sm">{item.location}</span>
                          </div>
                          <div className="text-xs text-slate-500">{item.room}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Custom Pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            windowSize={5}
          />
        </div>
      </div>
    </div>
  );
};

export default SeminarRegistration;