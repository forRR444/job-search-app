// src/api/job.ts

// ====================
// 型定義
// ====================
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

// ====================
// Job 一覧取得
// ====================
export async function listJobs(): Promise<Job[]> {
  const res = await fetch(`/api/v1/jobs`); // 相対パス
  if (!res.ok) {
    throw new Error(`GET /jobs failed: ${res.status}`);
  }
  return res.json();
}

// ====================
// Job 作成
// ====================
export async function createJob(payload: {
  title: string;
  category: string;
  salary: number;
}): Promise<Job> {
  const res = await fetch(`/api/v1/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Rails の Strong Parameters に合わせて { job: {...} } で送信
    body: JSON.stringify({ job: payload }),
  });

  if (res.status === 422) {
    const body = await res.json();
    throw { type: "validation", errors: body.errors } as ValidationError;
  }

  if (!res.ok) {
    throw new Error(`POST /jobs failed: ${res.status}`);
  }

  return res.json();
}
