import { apiFetch } from "./client";

export interface DisposalRecord {
  id: string;
  date: string;
  categoryId: string;
  category: string;
  name: string;
  points: number;
  status: string;
}

interface CreateRecordInput {
  categoryId: string;
  itemName: string;
  points?: number;
  status?: "success" | "failure";
}

export async function createRecord(input: CreateRecordInput): Promise<DisposalRecord> {
  return apiFetch<DisposalRecord>("/records", {
    method: "POST",
    auth: true,
    body: input,
  });
}

export async function fetchRecords(): Promise<DisposalRecord[]> {
  return apiFetch<DisposalRecord[]>("/records", { auth: true });
}
