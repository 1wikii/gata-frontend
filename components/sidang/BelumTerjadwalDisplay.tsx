"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Upload } from "lucide-react";
import { BelumTerjadwalData } from "@/types/belum-terjadwal";
import { api } from "@/utils/api";

const BelumTerjadwalDisplay = () => {
  const [data, setData] = useState<BelumTerjadwalData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/defense/belum-terjadwal");
        const result = await response.json();

        if (response.ok && result.data) {
          setData(result.data);
          setError(null);
        } else {
          setError(
            result.message || "Gagal memuat data. Silahkan coba lagi nanti."
          );
        }
      } catch (err) {
        setError("Gagal memuat data. Silahkan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hitung statistik
  const totalData = data.length;
  const proposalCount = data.filter((d) =>
    d.tipeSidang.toLowerCase().includes("proposal")
  ).length;
  const sidangCount = data.filter(
    (d) => !d.tipeSidang.toLowerCase().includes("proposal")
  ).length;

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-900">Error</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {data.length > 0 && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total Data
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{totalData}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Sidang Proposal
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {proposalCount}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Sidang Akhir
            </p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {sidangCount}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600 mt-4">Memuat data...</p>
        </div>
      )}

      {/* Table Section */}
      {data.length > 0 && !loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Data Belum Terjadwal
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Menampilkan {totalData} dari {totalData} data
          </p>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 sticky top-0 z-10">
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
                    NIM
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
                    NAMA
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
                    JUDUL
                  </th>
                  <th className="px-4 py-3 text-center text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
                    TIPE SIDANG
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
                    PEMBIMBING 1
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
                    PEMBIMBING 2
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
                    KK 1
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
                    KK 2
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-4 py-3 text-sm font-mono text-gray-900 whitespace-nowrap">
                      {item.nim}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap font-medium min-w-[180px]">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-[300px]">
                      <div className="line-clamp-2" title={item.judul}>
                        {item.judul || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${
                          item.tipeSidang.toLowerCase().includes("proposal")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {item.tipeSidang}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap min-w-[150px]">
                      {item.pembimbing1 || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap min-w-[150px]">
                      {item.pembimbing2 || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap min-w-[150px]">
                      {item.kk1 || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap min-w-[150px]">
                      {item.kk2 || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {data.length === 0 && !error && !loading && (
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Semua Data Sudah Terjadwal
          </h3>
          <p className="text-gray-600">
            Tidak ada data yang belum terjadwal saat ini.
          </p>
        </div>
      )}
    </div>
  );
};

BelumTerjadwalDisplay.displayName = "BelumTerjadwalDisplay";

export default BelumTerjadwalDisplay;
