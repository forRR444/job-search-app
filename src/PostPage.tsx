import { useState } from "react";
import { createJob } from "./api/job";            // ← パスOK（単数）
import { useNavigate } from "react-router-dom";
import { categories } from "./jobs";
import type { Category } from "./job";

/* ========= 求人投稿ページ ========= */
export function PostPage() {
  const nav = useNavigate();
  const [category, setCategory] = useState<"" | Category>("");
  const [salary, setSalary] = useState<string>("");   // 入力は文字列で保持
  const [title, setTitle] = useState("");

  // ★ ここが肝：FormDataをやめ、stateからpayloadを作る
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {            // 最小バリデーション
      alert("タイトルは必須です");
      return;
    }

    const salaryNum =
      salary.trim() === "" ? undefined : Number(salary); // "" は undefined、数値に変換
    // NaNガード（数字以外を弾く）
    const salaryVal = Number.isNaN(salaryNum as number) ? undefined : salaryNum;

    const payload = {
      title: trimmedTitle,
      category: category || undefined,  // 未選択なら送らない
      salary: salaryVal,                // undefined or number
    };

    try {
      await createJob(payload);   // ← RailsにPOST
      // フォーム初期化
      setCategory("");
      setSalary("");
      setTitle("");
      alert("求人を作成しました");
      nav("/");                   // 一覧へ
    } catch (err: any) {
      if (err?.type === "validation") {
        alert("入力エラー: " + JSON.stringify(err.errors));
      } else {
        console.error(err);
        alert("投稿に失敗しました: " + (err?.message ?? "unknown error"));
      }
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-8">
      <h2 className="text-2xl font-bold text-slate-900">求人投稿</h2>

      {/* 入力とボタンを同じ form に入れる */}
      <form onSubmit={onSubmit} className="mt-6 max-w-2xl">
        <label className="block max-w-md">
          <span className="text-sm font-semibold text-slate-800">求人カテゴリ選択</span>
          <select
            className="mt-2 block w-full border border-slate-300 bg-white px-4 h-11 text-[15px] rounded-none focus:outline-none focus:ring-2 focus:ring-sky-300"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "")}
          >
            <option value="">未選択</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
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
            placeholder="例: 200"
          />
        </label>

        <label className="mt-6 block">
          <span className="text-sm font-semibold text-slate-800">求人タイトル</span>
          <input
            className="mt-2 block w-full border border-slate-300 bg-white px-4 h-11 text-[15px] rounded-none focus:outline-none focus:ring-2 focus:ring-sky-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required   // ブラウザ側でも必須に
            placeholder="例: フロントエンドエンジニア（デザイン経験歓迎）"
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
