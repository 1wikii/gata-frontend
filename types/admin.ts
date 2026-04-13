export interface PeriodData {
  start_date: string;
  end_date: string;
  description: string;
}

export interface FPApprovalRequest {
  fpId: number;
  status: "approved" | "rejected";
}
