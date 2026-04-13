import ErrorValidation from "@/components/forms/errorMessage";
import { FormDatas } from "./index";
import { useState, useEffect } from "react";

interface Props {
  formDatas: FormDatas;
  setIsDaftarForm: (value: boolean) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  getLecturer: () => Promise<any>;
}

interface LecturerData {
  id: number;
  name: string;
  email: string;
  lecturer: {
    id: number;
    current_supervised_1: number;
    current_supervised_2: number;
    max_supervised_1: number;
    max_supervised_2: number;
  };
}

type formDatasField = Partial<Record<keyof FormDatas, string | null>>;
type FormErrors = Partial<Record<keyof FormDatas, string | null>>;

const JenisForm = ({
  formDatas,
  setIsDaftarForm,
  handleInputChange,
  handleStatusChange,
  getLecturer,
}: Props) => {
  const [lecturers, setLecturers] = useState<LecturerData[]>([]);
  const [lecturers1, setLecturers1] = useState<LecturerData[]>([]);
  const [lecturers2, setLecturers2] = useState<LecturerData[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const formDatasStr = formDatas as Record<string, any>; // only get string fields from formDatas

  // Auto-select jumlah anggota based on tipe tugas akhir
  useEffect(() => {
    // Fetch lecturers when the component mounts
    getLecturer()
      .then((data) => {
        setLecturers(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching lecturers:", error);
      });

    if (formDatas.type === "regular") {
      // For regular, automatically set to 1 member
      setTouched((prev) => ({ ...prev, jumlahAnggota: false }));
      const event = {
        target: { name: "jumlahAnggota", value: "1" },
      } as React.ChangeEvent<HTMLSelectElement>;
      handleInputChange(event);
    } else if (formDatas.type === "capstone") {
      // For capstone, reset jumlah anggota to empty
      const event = {
        target: { name: "jumlahAnggota", value: "" },
      } as React.ChangeEvent<HTMLSelectElement>;
      handleInputChange(event);
    }
  }, [formDatas.type]);

  // filter lecturers hanya slot pembimbing 1 dan 2 yang masih available saja
  useEffect(() => {
    const lecturers1 = lecturers.filter((lecturer) => {
      const hasSlotForSupervising1 =
        lecturer.lecturer.current_supervised_1 <
        lecturer.lecturer.max_supervised_1;
      return hasSlotForSupervising1;
    });
    const lecturers2 = lecturers.filter((lecturer) => {
      const hasSlotForSupervising2 =
        lecturer.lecturer.current_supervised_2 <
        lecturer.lecturer.max_supervised_2;
      return hasSlotForSupervising2;
    });
    setLecturers1(lecturers1);
    setLecturers2(lecturers2);
  }, [lecturers]);
  // Validation functions
  const validateField = (
    name: keyof formDatasField,
    value: any
  ): string | undefined => {
    switch (name) {
      case "type":
        if (!value) return "Tipe Tugas Akhir wajib diisi";
        break;
      case "jumlahAnggota":
        if (!value) return "Jumlah Anggota wajib diisi";
        break;
      case "status":
        if (!value) return "Status Tugas Akhir wajib diisi";
        break;
      case "supervisor1Id":
        if (!value) return "Dosen Pembimbing 1 wajib diisi";
        if (value && value === formDatas.supervisor2Id)
          return "Dosen Pembimbing tidak boleh sama";
        break;
      case "supervisor2Id":
        if (value && value === formDatas.supervisor1Id)
          return "Dosen Pembimbing tidak boleh sama";
        break;
      case "source_topic":
        if (!value) return "Sumber Topik wajib diisi";
        break;
      default:
        return undefined;
    }
    return undefined;
  };

  // validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formDatasStr) as Array<keyof formDatasField>).forEach(
      (key) => {
        const error = validateField(key, formDatas[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    );

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    name: keyof formDatasField,
    value: any
  ) => {
    handleInputChange(e);

    // Special case for status change
    if (name === "status") {
      handleStatusChange(e as React.ChangeEvent<HTMLSelectElement>);
    }

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (name: keyof formDatasField) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, formDatasStr[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleNext = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formDatasStr).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    // If valid, proceed to next form
    setIsDaftarForm(true);
  };

  return (
    <div className="space-y-6">
      <form className="space-y-6">
        {/* Tipe Tugas Akhir */}
        <div>
          <label className="form-label-input">Tipe Tugas Akhir</label>
          <div className="relative">
            <select
              name="type"
              value={formDatas.type}
              onChange={(e) => handleChange(e, "type", e.target.value)}
              onBlur={() => handleBlur("type")}
              className={`w-full px-4 py-3 rounded-lg border ${
                touched.type && errors.type
                  ? "border-red-500"
                  : "border-gray-300"
              } bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="" disabled>
                Pilih tipe tugas akhir
              </option>
              <option value="regular">Reguler</option>
              <option value="capstone">Capstone</option>
            </select>
          </div>
          {touched.type && errors.type && (
            <ErrorValidation error={errors.type} />
          )}
        </div>

        {/* Jumlah Anggota */}
        <div>
          <label className="form-label-input">Jumlah Anggota</label>
          <div className="relative">
            <select
              name="jumlahAnggota"
              value={formDatas.jumlahAnggota}
              onChange={(e) => handleChange(e, "jumlahAnggota", e.target.value)}
              onBlur={() => handleBlur("jumlahAnggota")}
              disabled={formDatas.type === "regular"}
              className={`w-full px-4 py-3 rounded-lg border ${
                touched.jumlahAnggota && errors.jumlahAnggota
                  ? "border-red-500"
                  : "border-gray-300"
              } bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formDatas.type === "regular"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <option value="" disabled>
                Pilih jumlah anggota
              </option>
              {formDatas.type === "capstone" && (
                <>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </>
              )}
              {formDatas.type === "regular" && <option value="1">1</option>}
            </select>
          </div>
          {touched.jumlahAnggota && errors.jumlahAnggota && (
            <ErrorValidation error={errors.jumlahAnggota} />
          )}
        </div>

        {/* Status Tugas Akhir */}
        <div>
          <label className="form-label-input">Status Tugas Akhir</label>
          <p className="text-gray-600 text-sm mb-2">
            Dispensasi hanya berlaku 1 semester aktif, jika lebih maka harus
            memiliki topik baru
          </p>
          <div className="relative">
            <select
              name="status"
              value={formDatas.status}
              onChange={(e) => handleChange(e, "status", e.target.value)}
              onBlur={() => handleBlur("status")}
              className={`w-full px-4 py-3 rounded-lg border ${
                touched.status && errors.status
              } bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="" disabled>
                Pilih status tugas akhir
              </option>
              <option value="baru">Baru</option>
              <option value="dispensasi">Dispensasi</option>
            </select>
          </div>
          {touched.status && errors.status && (
            <ErrorValidation error={errors.status} />
          )}
        </div>

        {/* Pilihan Dosen Pembimbing */}
        <div>
          <h3 className="form-label-input">Pilihan Dosen Pembimbing</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dosen Pembimbing 1 */}
            <div>
              <label className="block text-gray-700 mb-2">
                Dosen Pembimbing 1
              </label>
              <div className="relative">
                <select
                  name="supervisor1Id"
                  value={formDatas.supervisor1Id}
                  onChange={(e) =>
                    handleChange(e, "supervisor1Id", e.target.value)
                  }
                  onBlur={() => handleBlur("supervisor1Id")}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.supervisor1Id && errors.supervisor1Id
                  } bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="" disabled>
                    Pilih dosen pembimbing 1
                  </option>

                  {lecturers1.map((lecturer) => (
                    <option
                      key={lecturer.lecturer.id}
                      value={lecturer.lecturer.id}
                    >
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
              {touched.supervisor1Id && errors.supervisor1Id && (
                <ErrorValidation error={errors.supervisor1Id} />
              )}
            </div>

            {/* Dosen Pembimbing 2 */}
            <div>
              <label className="block text-gray-700 mb-2">
                Dosen Pembimbing 2
              </label>
              <div className="relative">
                <select
                  name="supervisor2Id"
                  value={formDatas.supervisor2Id}
                  onChange={(e) =>
                    handleChange(e, "supervisor2Id", e.target.value)
                  }
                  onBlur={() => handleBlur("supervisor2Id")}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.supervisor2Id && errors.supervisor2Id
                  } bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="" disabled>
                    Pilih dosen pembimbing 2
                  </option>
                  {lecturers2.map((lecturer) => (
                    <option
                      key={lecturer.lecturer.id}
                      value={lecturer.lecturer.id}
                    >
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
              {touched.supervisor2Id && errors.supervisor2Id && (
                <ErrorValidation error={errors.supervisor2Id} />
              )}
            </div>
          </div>
        </div>

        {/* Sumber Topik */}
        <div>
          <label className="form-label-input">Sumber Topik</label>
          <div className="relative">
            <select
              name="source_topic"
              value={formDatas.source_topic}
              onChange={(e) => handleChange(e, "source_topic", e.target.value)}
              onBlur={() => handleBlur("source_topic")}
              className={`w-full px-4 py-3 rounded-lg border ${
                touched.source_topic && errors.source_topic
              } bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="" disabled>
                Pilih sumber topik
              </option>
              <option value="dosen">Dosen</option>
              <option value="perusahaan">Perusahaan</option>
              <option value="mandiri">Mandiri</option>
            </select>
          </div>
          {touched.source_topic && errors.source_topic && (
            <ErrorValidation error={errors.source_topic} />
          )}
        </div>
      </form>

      {/* Next Button */}
      <div className="flex justify-center pt-6">
        <button
          className="form-submit-button"
          type="button"
          onClick={handleNext}
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

export default JenisForm;
