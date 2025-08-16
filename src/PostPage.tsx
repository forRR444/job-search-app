import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "./jobs";
import type { Category } from "./job";

/* ========= 求人投稿ページ ========= */
export function PostPage() {
  const nav = useNavigate();
  const [category, setCategory] = useState<"" | Category>("");
  const [salary, setSalary] = useState<string>("");
  const [title, setTitle] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !salary || !title.trim()) return;
    await new Promise(r => setTimeout(r, 400)); // ダミー送信
    nav("/"); // 送信後は一覧へ
  };

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-8">
      {/* 見出し：左寄せ */}
      <h2 className="text-2xl font-bold text-slate-900">求人投稿</h2>

      {/* フォーム本体：左寄せ・幅を抑える */}
      <form onSubmit={onSubmit} className="mt-6 max-w-2xl">
  <label className="block max-w-md">
    <span className="text-sm font-semibold text-slate-800">求人カテゴリ選択</span>
    <select
      className="mt-2 block w-full border border-slate-300 bg-white px-4 h-11 text-[15px] rounded-none focus:outline-none focus:ring-2 focus:ring-sky-300"
      value={category}
      onChange={(e) => setCategory(e.target.value as Category | "")} //as
    >
      <option value="" disabled>カテゴリを選択 ▼</option>
      {categories.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  </label>

  <label className="mt-6 block max-w-md">
    <span className="text-sm font-semibold text-slate-800">年収（万円）</span>
    <input
      type="number"
      inputMode="numeric"
      className="mt-2 block w-full border border-slate-300 bg-white px-4 h-11 text-[15px] rounded-none focus:outline-none focus:ring-2 focus:ring-sky-300"
      value={salary}
      onChange={(e) => setSalary(e.target.value)}
    />
  </label>

  <label className="mt-6 block ">
    <span className="text-sm font-semibold text-slate-800">求人タイトル</span>
    <input
      className="mt-2 block w-full border border-slate-300 bg-white px-4 h-11 text-[15px] rounded-none focus:outline-none focus:ring-2 focus:ring-sky-300"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  </label>

  <div className="mt-8">
    <button
      type="submit"
      className="inline-block bg-sky-600 hover:bg-sky-700 text-white px-12 py-3 rounded-md shadow-sm"
    >
      投稿
    </button>
  </div>
</form>

    </div>
  );
}

