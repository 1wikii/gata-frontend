"use client";

import ContainerTitleDosen from "@/components/cards/ContainerTitle";
import BlueButton from "@/components/buttons/BlueButton";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorValidation from "@/components/forms/errorMessage";

type FormData = {
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  deskripsi: string;
};

const SidangPage: React.FC<{}> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Submitted Data:", data);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <ContainerTitleDosen title="Kelola Jadwal" />
      <div className="bg-gray-background rounded-lg shadow-md p-6">
        {/* Form Title */}
        <h2 className="text-xl font-bold text-primary mb-6">
          Tambah Jadwal Baru
        </h2>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Row - Kegiatan and Tanggal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="flex flex-col gap-y-4">
              {/* Tanggal */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tanggal
                </label>
                <div className="relative">
                  <input
                    {...register("tanggal", {
                      required: "Tanggal tidak boleh kosong",
                    })}
                    aria-invalid={errors.tanggal ? true : false}
                    type="date"
                    name="tanggal"
                    className="w-full px-4 py-3 border bg-secondary border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pilih tanggal"
                  />
                </div>
                {errors.tanggal && (
                  <ErrorValidation error={errors.tanggal?.message || ""} />
                )}
              </div>

              {/* Waktu Mulai */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Waktu Mulai
                </label>
                <div className="relative">
                  <input
                    {...register("waktuMulai", {
                      required: "Masukkan waktu mulai",
                    })}
                    aria-invalid={errors.waktuMulai ? true : false}
                    type="time"
                    name="waktuMulai"
                    className="w-full px-4 py-3 border bg-secondary border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pilih waktu mulai"
                  />
                </div>
                {errors.waktuMulai && (
                  <ErrorValidation error={errors.waktuMulai?.message || ""} />
                )}
              </div>

              {/* Waktu Selesai */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Waktu Selesai
                </label>
                <div className="relative">
                  <input
                    {...register("waktuSelesai", {
                      required: "Masukkan waktu selesai",
                    })}
                    aria-invalid={errors.waktuSelesai ? true : false}
                    type="time"
                    name="waktuSelesai"
                    className="w-full px-4 py-3 border bg-secondary border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pilih waktu selesai"
                  />
                </div>
                {errors.waktuSelesai && (
                  <ErrorValidation error={errors.waktuSelesai?.message || ""} />
                )}
              </div>
            </section>

            <section>
              {/* Third Row - Deskripsi */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Deskripsi
                </label>
                <textarea
                  {...register("deskripsi")}
                  aria-invalid={errors.deskripsi ? true : false}
                  name="deskripsi"
                  className="w-full px-4 py-3 border bg-secondary border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-none"
                  placeholder="Masukkan deskripsi kegiatan"
                />
                {errors.deskripsi && (
                  <ErrorValidation error={errors.deskripsi?.message || ""} />
                )}
              </div>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <BlueButton props={{ type: "submit" }}>Simpan Jadwal</BlueButton>
            <Button type="button" variant="outline" className="px-6 py-2">
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SidangPage;
