//型定義
export type Job = {
  id: number;
  title: string;
  category: string;
  salary: number;
  created_at: string;
  updated_at: string;
};

export type ValidationError = {
  type: "validation";
  errors: string[]; // Rails 側で { errors: [...] } を返す前提
};

// Job一覧取得（相対パスに統一）
export async function listJobs(): Promise<Job[]> {
  const res = await fetch(`/api/v1/jobs`);
  if (!res.ok) throw new Error(`GET /jobs failed: ${res.status}`);
  return res.json();
}

// Job作成（相対パス + バリデーション維持）
// src/api/job.ts
export async function createJob(payload: {
  title: string;
  category: string;
  salary: number;
}) {
  const res = await fetch(`/api/v1/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job: payload }),
  });
  if (res.status === 422) {
    const body = await res.json();
    throw { type: "validation", errors: body.errors };
  }
  if (!res.ok) throw new Error(`POST /jobs failed: ${res.status}`);
  return res.json();
}
