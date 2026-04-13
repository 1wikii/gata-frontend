"use client";

import { NextPage } from "next";

import React, { useState } from "react";
import {
  CheckCircle,
  FileText,
  Star,
  BarChart3,
  Calendar,
  ChevronDown,
} from "lucide-react";
import CardSchedule from "@/components/ui/card-schedule";

const Home: NextPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fiturUtama = [
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: "Pendaftaran Tugas Akhir",
      description: "Memudahkan mahasiswa untuk mengajukan judul tugas akhir.",
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Monitoring Bimbingan",
      description:
        "Catat dan pantau progres bimbingan secara real-time dengan sistem tracking yang komprehensif.",
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: "Penilaian",
      description:
        "Penilaian lebih terstruktur, transparan, dan terdokumentasi dengan sistem scoring yang objektif.",
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: "Berita Acara Otomatis",
      description:
        "Dokumen berita acara dapat dihasilkan secara instan dengan template yang sudah terstandarisasi.",
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: "Jadwal Sidang",
      description:
        "Mahasiswa dapat langsung melihat jadwal sidang tanpa login melalui portal publik yang mudah diakses.",
    },
  ];

  const faqData = [
    {
      question: "Apa itu GATA?",
      answer:
        "GATA adalah portal terpadu untuk mendukung administrasi tugas akhir.",
    },
    {
      question: "Siapa yang bisa menggunakan GATA?",
      answer:
        "Mahasiswa, dosen pembimbing, penguji, dan admin dapat menggunakan sistem ini.",
    },
    {
      question: "Apa keuntungan menggunakan GATA?",
      answer:
        "Proses administrasi lebih efisien, transparan, dan terstruktur dengan dokumentasi yang baik.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          GERBANG ADMINISTRASI
          <br />
          TUGAS AKHIR
        </h1>
        <p className="text-lg md:text-xl mb-8 text-blue-50">
          Mempermudah mahasiswa, dosen, dan admin dalam proses monitoring,
          penilaian, serta berita acara tugas akhir.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`}
            className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 rounded-md font-semibold transition-colors"
          >
            Login
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`}
            className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-8 py-3 rounded-md font-semibold transition-colors"
          >
            Daftar
          </a>
        </div>
      </section>

      {/* Tentang GATA Section */}
      <section className="min-h-screen py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Tentang GATA
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-700 leading-relaxed mb-6">
                GATA adalah portal terpadu untuk mendukung administrasi tugas
                akhir. Sistem ini dirancang agar mahasiswa, dosen, dan admin
                dapat mengelola proses validasi, monitoring bimbingan,
                penilaian, berita acara, serta jadwal sidang secara lebih
                efisien dan transparan.
              </p>
              <div className="flex gap-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="bg-blue-600 p-3 rounded-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}
                alt="GATA Illustration"
                className="w-64 h-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama Section */}
      <section className="py-16 px-4">
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_URL}`}
          className="max-w-6xl mx-auto cursor-pointer"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Fitur Utama
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fiturUtama.map((fitur, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 mb-4">{fitur.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {fitur.title}
                </h3>
                <p className="text-gray-600">{fitur.description}</p>
              </div>
            ))}
          </div>
        </a>
      </section>

      {/* Jadwal Sidang Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Jadwal Sidang Tugas Akhir
          </h2>
          <CardSchedule />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            FAQ
          </h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 text-left">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm md:text-base">
            © 2025 Teknik Informatika ITERA. All rights reserved || Andika
            Setiawan, Martin C.T Manullang, Ahmad Dwiky Zerro Dixxon, Rafli
            Hafidz Fadilah
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
