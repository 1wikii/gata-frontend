export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: "low" | "high";
  is_published: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AnnouncementFormState {
  title: string;
  content: string;
  priority: "low" | "high";
  is_published: boolean;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
