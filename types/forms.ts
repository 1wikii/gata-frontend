export interface ErrorValidation {
  field: string;
  msg: string;
}

export interface Message {
  type: "error" | "success" | string;
  field?: string;
  text: string;
}
