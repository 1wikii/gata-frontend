"use client";

import React, { useEffect, useState } from "react";
import {
  Upload,
  Settings,
  Play,
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  Loader,
  Trash2,
  ChevronRight,
  Database,
} from "lucide-react";
import { api } from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface SchedulerConfig {
  req_fname: string;
  avail_fname: string;
  parallel_event: number;
  default_timeslot: number;
  default_timeslot_sidang: number;
  capstone_duration_2: number;
  capstone_duration_3: number;
  capstone_duration_4: number;
  capstone_duration_sidang_2: number;
  capstone_duration_sidang_3: number;
  capstone_duration_sidang_4: number;
  out_fname: string;
  out_timeslot: string;
  out_lectureschedule: string;
  time_slot_dur: number;
}

interface SchedulerStatus {
  running: boolean;
  completed: boolean;
  error: string | null;
  output: string[];
}

const PenjadwalanPage = () => {
  const [inputFiles, setInputFiles] = useState<string[]>([]);
  const [outputFiles, setOutputFiles] = useState<string[]>([]);
  const [config, setConfig] = useState<SchedulerConfig>({
    req_fname: "",
    avail_fname: "",
    parallel_event: 1,
    default_timeslot: 30,
    default_timeslot_sidang: 45,
    capstone_duration_2: 45,
    capstone_duration_3: 60,
    capstone_duration_4: 75,
    capstone_duration_sidang_2: 60,
    capstone_duration_sidang_3: 75,
    capstone_duration_sidang_4: 90,
    out_fname: "schedule_output.csv",
    out_timeslot: "timeslot_output.csv",
    out_lectureschedule: "lecture_schedule.csv",
    time_slot_dur: 30,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [schedulerOutput, setSchedulerOutput] = useState<string[]>([]);
  const [schedulerError, setSchedulerError] = useState<string | null>(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [activeTab, setActiveTab] = useState<"configuration" | "schedule">(
    "configuration"
  );
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [successDialog, setSuccessDialog] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [isImportingSchedule, setIsImportingSchedule] = useState(false);
  const [selectedScheduleFile, setSelectedScheduleFile] = useState<File | null>(
    null
  );
  const importScheduleInputRef = React.useRef<HTMLInputElement>(null);

  const schedulerBaseUrl =
    process.env.NEXT_PUBLIC_SCHEDULER_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await fetch(`${schedulerBaseUrl}`);
      const data = await response.json();
      if (response.ok) {
        setInputFiles(data.input_files || []);
        setOutputFiles(data.output_files || []);
        setConfig(data.config || config);
      }
    } catch (error) {
      console.warn("Error fetching initial data:", error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: "request" | "availability"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
      const response = await fetch(`${schedulerBaseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setInputFiles([...inputFiles, data.filename]);
        setSuccessDialog({
          open: true,
          title: "File Berhasil Upload",
          message: `${fileType} file berhasil diupload: ${data.filename}`,
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Error uploading: ${error}`);
    } finally {
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });
    }
  };

  const handleConfigChange = (field: keyof SchedulerConfig, value: any) => {
    const newValue = typeof config[field] === "number" ? Number(value) : value;
    setConfig((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      const response = await fetch(`${schedulerBaseUrl}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      if (data.success) {
        setSuccessDialog({
          open: true,
          title: "Konfigurasi Tersimpan",
          message: "Konfigurasi berhasil disimpan!",
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleRunScheduler = async () => {
    setIsRunning(true);
    setIsCompleted(false);
    setSchedulerOutput([]);
    setSchedulerError(null);

    try {
      const response = await fetch(`${schedulerBaseUrl}/run`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        const interval = setInterval(
          () => checkSchedulerStatus(interval),
          1000
        );
        setStatusCheckInterval(interval);
      } else {
        alert(`Error: ${data.error}`);
        setIsRunning(false);
      }
    } catch (error) {
      alert(`Error: ${error}`);
      setIsRunning(false);
    }
  };

  const checkSchedulerStatus = async (interval?: NodeJS.Timeout) => {
    try {
      const response = await fetch(`${schedulerBaseUrl}/status`);
      const data: SchedulerStatus = await response.json();

      if (data.output && data.output.length > 0) {
        setSchedulerOutput(data.output);
      }

      if (!data.running) {
        if (interval) clearInterval(interval);
        setStatusCheckInterval(null);
        setIsRunning(false);

        if (data.completed) {
          setIsCompleted(true);
          setTimeout(async () => {
            await fetchInitialData();
          }, 1500);
        } else if (data.error) {
          setSchedulerError(data.error);
        }
      }
    } catch (error) {
      console.warn("Error checking status:", error);
    }
  };

  const handleDownloadFile = (filename: string) => {
    window.location.href = `${schedulerBaseUrl}/download/${filename}`;
  };

  const handleDeleteFile = async (filename: string) => {
    if (!confirm(`Delete ${filename}?`)) return;
    try {
      const response = await fetch(`${schedulerBaseUrl}/delete/${filename}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setInputFiles(inputFiles.filter((f) => f !== filename));
        setOutputFiles(outputFiles.filter((f) => f !== filename));
        setSuccessDialog({
          open: true,
          title: "File Dihapus",
          message: `${filename} berhasil dihapus`,
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleExportRequestCSV = async () => {
    setIsExportingCSV(true);
    try {
      const response = await api.get("/admin/defense/export-csv");

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `req_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setSuccessDialog({
          open: true,
          title: "Export Berhasil",
          message: "Request CSV berhasil diunduh",
        });
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || "Gagal export CSV"}`);
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert(`Error: ${error}`);
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleImportScheduleFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedScheduleFile(file);
  };

  const handleSendImportSchedule = async () => {
    if (!selectedScheduleFile) return;

    setIsImportingSchedule(true);
    try {
      // Buat FormData untuk upload ke backend
      const formData = new FormData();
      formData.append("schedule_file", selectedScheduleFile);

      // Upload ke backend API
      const uploadResponse = await api.postWithFile(
        "/admin/defense/import-schedule",
        formData
      );

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        setSuccessDialog({
          open: true,
          title: "Jadwal Berhasil Diimport",
          message: "Jadwal berhasil diimport ke database",
        });
        // Reset file input dan selected file
        setSelectedScheduleFile(null);
        if (importScheduleInputRef.current) {
          importScheduleInputRef.current.value = "";
        }
      } else {
        const error = await uploadResponse.json();
        console.error("Failed to import schedule:", error);
        alert(`Error importing schedule: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error importing schedule file:", error);
      alert(`Error: ${error}`);
    } finally {
      setIsImportingSchedule(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎓 Penjadwalan Sidang
          </h1>
          <p className="text-gray-600">
            Sistem otomatis untuk menjadwalkan sidang tugas akhir
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("configuration")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "configuration"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            ⚙️ Konfigurasi
          </button>
        </div>

        {/* Configuration Tab */}
        {activeTab === "configuration" && (
          <div className="space-y-6">
            {/* Export Request CSV */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <CardTitle>💾 Export Request CSV</CardTitle>
                </div>
                <CardDescription>
                  Export data sidang dari database ke format Request CSV
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <Database className="w-12 h-12 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        📊 Export Data Sidang
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Unduh data sidang yang sudah tersimpan di database dalam
                        format CSV yang siap digunakan untuk penjadwalan
                      </p>
                      <button
                        onClick={handleExportRequestCSV}
                        disabled={isExportingCSV}
                        className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
                      >
                        {isExportingCSV ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Mengexport...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            📥 Export Request CSV
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <CardTitle>📁 Upload Files</CardTitle>
                </div>
                <CardDescription>Upload CSV files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-all cursor-pointer relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e, "request")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-semibold text-gray-700">
                      📄 Request CSV
                    </p>
                    <p className="text-sm text-gray-500">Click to select</p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-all cursor-pointer relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e, "availability")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-semibold text-gray-700">
                      📅 Availability CSV
                    </p>
                    <p className="text-sm text-gray-500">Click to select</p>
                  </div>
                </div>

                {inputFiles.length > 0 ? (
                  <div className="space-y-2">
                    {inputFiles.map((file) => (
                      <div
                        key={file}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <span className="flex items-center gap-2 text-gray-700">
                          <FileText className="w-4 h-4" />
                          {file}
                        </span>
                        <button
                          onClick={() => handleDeleteFile(file)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                    No files uploaded
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <CardTitle>⚙️ Configuration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* File Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      📋 File Selection
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Request File:
                        </label>
                        <select
                          value={config.req_fname}
                          onChange={(e) =>
                            handleConfigChange("req_fname", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          {inputFiles
                            .filter((f) => f.startsWith("req_"))
                            .map((f) => (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Availability File:
                        </label>
                        <select
                          value={config.avail_fname}
                          onChange={(e) =>
                            handleConfigChange("avail_fname", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          {inputFiles
                            .filter((f) => f.startsWith("avail_"))
                            .map((f) => (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* General Settings */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      ⚡ General Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parallel Events:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={config.parallel_event}
                          onChange={(e) =>
                            handleConfigChange("parallel_event", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Timeslot (Proposal):
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={config.default_timeslot}
                          onChange={(e) =>
                            handleConfigChange(
                              "default_timeslot",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Timeslot (Sidang):
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={config.default_timeslot_sidang}
                          onChange={(e) =>
                            handleConfigChange(
                              "default_timeslot_sidang",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Capstone Duration (Proposal) */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      📚 Durasi Capstone (Proposal)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capstone 2 Students:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={config.capstone_duration_2}
                          onChange={(e) =>
                            handleConfigChange(
                              "capstone_duration_2",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capstone 3 Students:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={config.capstone_duration_3}
                          onChange={(e) =>
                            handleConfigChange(
                              "capstone_duration_3",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capstone 4 Students:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={config.capstone_duration_4}
                          onChange={(e) =>
                            handleConfigChange(
                              "capstone_duration_4",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Capstone Duration (Sidang) */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      🎓 Durasi Capstone (Sidang)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capstone Sidang 2 Students:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={config.capstone_duration_sidang_2}
                          onChange={(e) =>
                            handleConfigChange(
                              "capstone_duration_sidang_2",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capstone Sidang 3 Students:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={config.capstone_duration_sidang_3}
                          onChange={(e) =>
                            handleConfigChange(
                              "capstone_duration_sidang_3",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capstone Sidang 4 Students:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={config.capstone_duration_sidang_4}
                          onChange={(e) =>
                            handleConfigChange(
                              "capstone_duration_sidang_4",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Output Settings */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      📤 Output Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Output Filename:
                        </label>
                        <input
                          type="text"
                          value={config.out_fname}
                          onChange={(e) =>
                            handleConfigChange("out_fname", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeslot Output:
                        </label>
                        <input
                          type="text"
                          value={config.out_timeslot}
                          onChange={(e) =>
                            handleConfigChange("out_timeslot", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lecture Schedule Output:
                        </label>
                        <input
                          type="text"
                          value={config.out_lectureschedule}
                          onChange={(e) =>
                            handleConfigChange(
                              "out_lectureschedule",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time Slot Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⏱️ Time Slot Duration (minutes):
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={config.time_slot_dur}
                      onChange={(e) =>
                        handleConfigChange("time_slot_dur", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveConfig}
                    disabled={isSavingConfig}
                    className="w-full py-2 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {isSavingConfig && (
                      <Loader className="w-4 h-4 animate-spin" />
                    )}
                    💾 Save Configuration
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Run */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-green-600" />
                  <CardTitle>▶️ Run Scheduler</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {isCompleted && (
                  <div className="mb-4 flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700">✓ Complete</span>
                  </div>
                )}
                <button
                  onClick={handleRunScheduler}
                  disabled={
                    isRunning || !config.req_fname || !config.avail_fname
                  }
                  className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  {isRunning && (
                    <Loader className="w-5 h-5 animate-spin inline mr-2" />
                  )}
                  🚀 Start
                </button>
              </CardContent>
            </Card>

            {/* Output */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-indigo-600" />
                  <CardTitle>📊 Output Files</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {outputFiles.length > 0 ? (
                  <div className="space-y-2">
                    {outputFiles.map((file) => (
                      <div
                        key={file}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <span className="flex items-center gap-2 text-gray-700 font-medium">
                          <FileText className="w-5 h-5 text-indigo-600" />
                          {file}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadFile(file)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Download
                          </button>

                          <button
                            onClick={() => handleDeleteFile(file)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                    No output files
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Import Schedule */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <CardTitle>📥 Import Jadwal ke Database</CardTitle>
                </div>
                <CardDescription>
                  Upload file final_output CSV yang sudah direview untuk
                  diimport ke database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <Database className="w-12 h-12 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        🔄 Upload Schedule CSV
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Pilih file final_output CSV yang sudah Anda review untuk
                        diimport ke database. File harus dalam format CSV yang
                        sesuai dengan struktur jadwal.
                      </p>
                      <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-all cursor-pointer block mb-4">
                        <input
                          ref={importScheduleInputRef}
                          type="file"
                          accept=".csv"
                          onChange={handleImportScheduleFile}
                          className="hidden"
                        />
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="font-semibold text-gray-700">
                          📄 Pilih File CSV
                        </p>
                        <p className="text-sm text-gray-500">
                          atau drag and drop
                        </p>
                      </label>

                      {selectedScheduleFile && (
                        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <p className="text-sm font-medium text-emerald-900 mb-2">
                            📋 File yang dipilih:
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="flex items-center gap-2 text-emerald-700">
                              <FileText className="w-4 h-4" />
                              {selectedScheduleFile.name}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedScheduleFile(null);
                                if (importScheduleInputRef.current) {
                                  importScheduleInputRef.current.value = "";
                                }
                              }}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Hapus
                            </button>
                          </div>
                          <button
                            onClick={handleSendImportSchedule}
                            disabled={
                              isImportingSchedule || !selectedScheduleFile
                            }
                            className="w-full px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors"
                          >
                            {isImportingSchedule ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Sedang Mengirim...
                              </>
                            ) : (
                              <>
                                <Database className="w-4 h-4" />
                                📤 Kirim ke Database
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {!selectedScheduleFile && (
                        <div className="text-sm text-gray-500 text-center">
                          Belum ada file yang dipilih
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success Dialog */}
        <AlertDialog
          open={successDialog.open}
          onOpenChange={() =>
            setSuccessDialog({ ...successDialog, open: false })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                {successDialog.title}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {successDialog.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() =>
                  setSuccessDialog({ ...successDialog, open: false })
                }
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PenjadwalanPage;
