// BAP (Berita Acara Penilaian) Types

export type StatusRevisi = "menunggu" | "revisi" | "selesai";
export type JenisSidang = "proposal" | "hasil";

// Admin Types
export interface RubricQuestion {
  id: number;
  question: string;
  weight: number;
  category: "tugas-akhir" | "presentasi";
  subCategory: string; // e.g., "Introduction", "Methodology"
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRubricRequest {
  question: string;
  weight: number;
  category: "tugas-akhir" | "presentasi";
  subCategory: string;
}

export interface UpdateRubricRequest extends CreateRubricRequest {
  id: number;
}

// Dosen Types
export interface StudentDefense {
  id: number;
  nim: string;
  name: string;
  thesisTitle: string;
  defenseType: JenisSidang;
  defenseDate: string;
  defenseTime: string;
  gradingStatus: "belum-dinilai" | "sudah-dinilai";
  revisionStatus: StatusRevisi;
}

export interface GradingItem {
  questionId: number;
  question: string;
  weight: number;
  score: 0 | 1 | 2; // No (0), Partially (1), Yes (2)
  points: number; // score * weight
}

export interface GradingSection {
  category: string;
  subCategory: string;
  items: GradingItem[];
  totalPoints: number;
  maxPoints: number;
}

export interface GradingForm {
  studentId: number;
  defenseId: number;
  thesisGrading: GradingSection[];
  presentationGrading: GradingSection[];
  revisionNotes: string;
  totalScore: number;
  passStatus: string; // "LULUS" or "TIDAK LULUS"
}

export interface SubmitGradingRequest {
  studentId: number;
  defenseId: number;
  grading: {
    questionId: number;
    score: 0 | 1 | 2;
  }[];
  revisionNotes: string;
}

// Mahasiswa Types
export interface GradingResult {
  defenseId: number;
  defenseType: JenisSidang;
  defenseDate: string;
  thesisGrading: GradingSection[];
  presentationGrading: GradingSection[];
  totalScore: number;
  passStatus: string;
  examiners: {
    name: string;
    nip: string;
  }[];
}

export interface RevisionNote {
  id: number;
  defenseId: number;
  sender: string; // Lecturer name
  date: string;
  content: string;
  status: StatusRevisi;
}

export interface BAPDownload {
  defenseId: number;
  pdfUrl: string;
  fileName: string;
}
