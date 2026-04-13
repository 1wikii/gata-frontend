export interface Dosen {
  id: number;
  fpId: number;
  nama: string;
  nip: string;
  lecturer_code: string;
}

export type TipeSidang = "proposal" | "hasil";

export interface Links {
  id: string;
  type: "draft" | "ppt";
  email: string;
  name: string;
  url: string;
}

export interface PengajuanSidangForm {
  tipeSidang: TipeSidang;
  fpId: number;
  lecturerId: number;
  expertiseGroup1Id: number;
  expertiseGroup2Id: number;
  finalDraftLinks: Links[];
  pptLinks: Links[];
}
