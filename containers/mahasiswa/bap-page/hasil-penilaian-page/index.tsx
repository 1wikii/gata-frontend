"use client";

import React, { useState, useEffect } from "react";
import { Download, FileText, ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import JenisSidangBadge from "@/components/badges/JenisSidangBadge";
import StatusRevisiBadge from "@/components/badges/StatusRevisiBadge";
import { api } from "@/utils/api";
import { GradingResult, RevisionNote } from "@/types/bap";

// Sample data for preview
const sampleGradingResult: GradingResult = {
  defenseId: 1,
  defenseType: "proposal",
  defenseDate: "2025-11-10T09:00:00Z",
  totalScore: 85,
  passStatus: "LULUS",
  thesisGrading: [
    {
      category: "tugas-akhir",
      subCategory: "Introduction",
      totalPoints: 8,
      maxPoints: 10,
      items: [
        {
          questionId: 1,
          question: "Does the introduction clearly state the research problem?",
          weight: 2,
          score: 2,
          points: 4,
        },
        {
          questionId: 2,
          question: "Is the background information adequate and relevant?",
          weight: 2,
          score: 2,
          points: 4,
        },
      ],
    },
    {
      category: "tugas-akhir",
      subCategory: "Methodology",
      totalPoints: 6,
      maxPoints: 8,
      items: [
        {
          questionId: 3,
          question: "Is the research design appropriate for the objectives?",
          weight: 2,
          score: 2,
          points: 4,
        },
        {
          questionId: 4,
          question: "Are data collection methods clearly described?",
          weight: 2,
          score: 1,
          points: 2,
        },
      ],
    },
  ],
  presentationGrading: [
    {
      category: "presentasi",
      subCategory: "Introduction",
      totalPoints: 7,
      maxPoints: 8,
      items: [
        {
          questionId: 5,
          question: "Does the presentation clearly state the research problem?",
          weight: 2,
          score: 2,
          points: 4,
        },
        {
          questionId: 6,
          question: "Is the background information presented effectively?",
          weight: 2,
          score: 1,
          points: 2,
        },
        {
          questionId: 7,
          question: "Are the research objectives clearly communicated?",
          weight: 1,
          score: 1,
          points: 1,
        },
      ],
    },
  ],
  examiners: [
    { name: "Dr. Budi Santoso, M.Kom", nip: "197001011995031001" },
    { name: "Dr. Ahmad Rizki, S.Kom, M.T", nip: "198505102010121002" },
  ],
};

const sampleRevisionNotes: RevisionNote[] = [
  {
    id: 1,
    defenseId: 1,
    sender: "Dr. Budi Santoso, M.Kom",
    date: "2025-11-10T14:00:00Z",
    content:
      "Perbaiki metodologi penelitian pada bab 3, tambahkan referensi terkait algoritma yang digunakan. Perbaiki juga penulisan pada abstrak bahasa Inggris.",
    status: "revisi",
  },
  {
    id: 2,
    defenseId: 1,
    sender: "Dr. Ahmad Rizki, S.Kom, M.T",
    date: "2025-11-10T14:15:00Z",
    content:
      "Tambahkan diagram flowchart untuk menjelaskan alur sistem yang dibangun. Perbaiki tabel perbandingan pada tinjauan pustaka.",
    status: "revisi",
  },
];

const MahasiswaHasilPenilaianPage: React.FC = () => {
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(
    null
  );
  const [revisionNotes, setRevisionNotes] = useState<RevisionNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usePreviewData, setUsePreviewData] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch grading result
      const resultResponse = await api.get("/mahasiswa/bap/hasil-penilaian");
      const resultData = await resultResponse.json();
      
      if (resultData.data) {
        setGradingResult(resultData.data);
        setUsePreviewData(false);
      } else {
        // Use sample data for preview
        setGradingResult(sampleGradingResult);
        setUsePreviewData(true);
      }

      // Fetch revision notes
      const notesResponse = await api.get("/mahasiswa/bap/notulen-revisi");
      const notesData = await notesResponse.json();
      
      if (notesData.data && notesData.data.length > 0) {
        setRevisionNotes(notesData.data);
      } else if (usePreviewData) {
        setRevisionNotes(sampleRevisionNotes);
      }

      // Expand first section by default
      if (resultData.data?.thesisGrading?.length > 0) {
        setExpandedSections(
          new Set([resultData.data.thesisGrading[0].subCategory])
        );
      } else if (sampleGradingResult.thesisGrading.length > 0) {
        setExpandedSections(
          new Set([sampleGradingResult.thesisGrading[0].subCategory])
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Use sample data on error
      setGradingResult(sampleGradingResult);
      setRevisionNotes(sampleRevisionNotes);
      setUsePreviewData(true);
      setExpandedSections(
        new Set([sampleGradingResult.thesisGrading[0].subCategory])
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (subCategory: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subCategory)) {
        newSet.delete(subCategory);
      } else {
        newSet.add(subCategory);
      }
      return newSet;
    });
  };

  const handleDownloadBAP = async () => {
    try {
      const response = await api.get(
        `/mahasiswa/bap/download/${gradingResult?.defenseId}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BAP_Sidang_${gradingResult?.defenseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading BAP:", error);
      alert("Gagal mengunduh BAP");
    }
  };

  const getPassStatus = (totalScore: number) => {
    return totalScore >= 70 ? "LULUS" : "TIDAK LULUS";
  };

  const getPassColor = (totalScore: number) => {
    return totalScore >= 70
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!gradingResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">Hasil penilaian belum tersedia</p>
                <p className="text-sm">Silakan tunggu hingga sidang selesai dinilai</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Preview Mode Banner */}
        {usePreviewData && (
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FileText className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Mode Preview:</strong> Menampilkan data contoh. Data sebenarnya akan muncul setelah sidang dinilai oleh dosen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hasil Penilaian Sidang
          </h1>
          <p className="text-gray-600">
            Lihat hasil penilaian dan catatan revisi dari sidang Anda
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-6 shadow-xl border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">Ringkasan Penilaian</CardTitle>
                <div className="flex gap-2 mb-3">
                  <JenisSidangBadge jenis={gradingResult.defenseType} />
                  <Badge variant="outline" className="bg-white">
                    {new Date(gradingResult.defenseDate).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </Badge>
                </div>
              </div>
              <Button
                onClick={handleDownloadBAP}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={usePreviewData}
              >
                <Download className="w-4 h-4 mr-2" />
                Download BAP
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-600 mb-2">Total Nilai</p>
                <p className="text-5xl font-bold text-blue-600">
                  {gradingResult.totalScore}
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-gray-600 mb-2">Status Kelulusan</p>
                <p
                  className={`text-4xl font-bold px-6 py-3 rounded-lg inline-block border-2 ${getPassColor(
                    gradingResult.totalScore
                  )}`}
                >
                  {getPassStatus(gradingResult.totalScore)}
                </p>
              </div>
            </div>

            {/* Examiners */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Dosen Penguji:
              </h3>
              <div className="flex flex-wrap gap-3">
                {gradingResult.examiners.map((examiner, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-white text-gray-700"
                  >
                    {examiner.name} ({examiner.nip})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Penilaian Tugas Akhir */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Detail Penilaian Tugas Akhir
          </h2>
          <div className="space-y-4">
            {gradingResult.thesisGrading.map((section, idx) => (
              <Card key={section.subCategory} className="shadow-lg">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSection(section.subCategory)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {idx + 1}. {section.subCategory}
                      </CardTitle>
                      <CardDescription>
                        Poin: {section.totalPoints} / {section.maxPoints}
                      </CardDescription>
                    </div>
                    {expandedSections.has(section.subCategory) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
                {expandedSections.has(section.subCategory) && (
                  <CardContent>
                    <div className="space-y-3">
                      {section.items.map((item, itemIdx) => (
                        <div
                          key={item.questionId}
                          className="border-b border-gray-200 pb-3 last:border-0"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-gray-900 flex-1">
                              {itemIdx + 1}. {item.question}
                            </p>
                            <div className="text-right">
                              <Badge
                                variant={
                                  item.score === 2
                                    ? "default"
                                    : item.score === 1
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {item.score === 2
                                  ? "Yes"
                                  : item.score === 1
                                  ? "Partially"
                                  : "No"}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.points} / {item.weight * 2} poin
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Detail Penilaian Presentasi */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Detail Penilaian Presentasi
          </h2>
          <div className="space-y-4">
            {gradingResult.presentationGrading.map((section, idx) => (
              <Card key={section.subCategory} className="shadow-lg">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSection(section.subCategory)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {idx + 1}. {section.subCategory}
                      </CardTitle>
                      <CardDescription>
                        Poin: {section.totalPoints} / {section.maxPoints}
                      </CardDescription>
                    </div>
                    {expandedSections.has(section.subCategory) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
                {expandedSections.has(section.subCategory) && (
                  <CardContent>
                    <div className="space-y-3">
                      {section.items.map((item, itemIdx) => (
                        <div
                          key={item.questionId}
                          className="border-b border-gray-200 pb-3 last:border-0"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-gray-900 flex-1">
                              {itemIdx + 1}. {item.question}
                            </p>
                            <div className="text-right">
                              <Badge
                                variant={
                                  item.score === 2
                                    ? "default"
                                    : item.score === 1
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {item.score === 2
                                  ? "Yes"
                                  : item.score === 1
                                  ? "Partially"
                                  : "No"}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.points} / {item.weight * 2} poin
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Revision Notes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Catatan Revisi
          </h2>
          {revisionNotes.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="py-12">
                <div className="text-center text-gray-500">
                  Belum ada catatan revisi
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {revisionNotes.map((note) => (
                <Card
                  key={note.id}
                  className="shadow-lg border-l-4 border-blue-500"
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {note.sender}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(note.date).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <StatusRevisiBadge status={note.status} />
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MahasiswaHasilPenilaianPage;
