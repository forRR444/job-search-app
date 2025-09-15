// src/api/job.ts

// ====================
// 型定義
// ====================
export type Job = {
  id: number;
  title: string;
  description: string; // 追加
  category: string;
  salary: number;
  created_at: string;
  updated_at: string;
};

// src/api/job.ts

// どんな状況でも同一オリジンに向けるためのヘルパ
const apiUrl = (path: string) => {
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "";
  return `${origin}${path}`;
};

// ====================
// Job 一覧取得
// ====================
export async function listJobs(): Promise<Job[]> {
  const res = await fetch(apiUrl("/api/v1/jobs"));
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
  description: string;
  category: string;
  salary: number;
}): Promise<Job> {
  const res = await fetch(apiUrl("/api/v1/jobs"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job: payload }), // Rails Strong Params 用
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
