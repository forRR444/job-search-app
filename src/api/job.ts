// src/api/jobs.ts
const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

//型定義
export type Job = {
  id: number;
  title: string;
  category: string;
  salary: number;
  created_at: string;
  updated_at: string;
};

//Job一覧取得
export async function listJobs(): Promise<Job[]> {
  const res = await fetch(`${BASE}/api/v1/jobs`);
  if (!res.ok) throw new Error(`GET /jobs failed: ${res.status}`);
  return res.json();
}

//Job作成
export async function createJob(payload: { title: string; category: string; salary: number }) {
  const res = await fetch(`${BASE}/api/v1/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // RailsのStrong Parametersに合わせて { job: {...} } で送る
    body: JSON.stringify({ job: payload }),
  });
  if (res.status === 422) {
    //バリデーションエラー
    const body = await res.json();
    throw { type: "validation", errors: body.errors };
  }
  if (!res.ok) {
    //その他のエラー
    throw new Error(`POST /jobs failed: ${res.status}`);
  }
  //成功
  return res.json();
}
