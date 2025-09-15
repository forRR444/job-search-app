import { useState } from "react";
import { createJob } from "./api/job";
import { useNavigate } from "react-router-dom";
import { categories } from "./jobs";
import type { Category } from "./job";

export function PostPage() {
  const nav = useNavigate();
  const [category, setCategory] = useState<"" | Category>("");
  const [salary, setSalary] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // 👈 description追加

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("タイトルは必須です");
      return;
    }
    if (!category) {
      alert("カテゴリは必須です");
      return;
    }
    if (!description.trim()) {
      alert("仕事内容は必須です");
      return;
    }

    const salaryNum = salary.trim() === "" ? undefined : Number(salary);
    const salaryVal = Number.isNaN(salaryNum as number) ? undefined : salaryNum;

    const payload = {
      title: trimmedTitle,
      description, // 👈 descriptionを送る
      category,
      salary: salaryVal,
    };

    try {
      await createJob(payload);
      setCategory("");
      setSalary("");
      setTitle("");
      setDescription(""); // 👈 初期化
      alert("求人を作成しました");
      nav("/");
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

      <form onSubmit={onSubmit} className="mt-6 max-w-2xl">
        {/* カテゴリ */}
        <label className="block max-w-md">
          <span className="text-sm font-semibold text-slate-800">
            求人カテゴリ選択
          </span>
          <select
            className="mt-2 block w-full border border-slate-300 bg-white px-4 h-11 text-[15px]"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            required
          >
            <option value="" disabled hidden>
              カテゴリを選択してください
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {/* 年収 */}
        <label className="mt-6 block max-w-md">
          <span className="text-sm font-semibold text-slate-800">
            年収（万円）
          </span>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
            placeholder="例: 200"
            className="mt-2 block w-full border border-slate-300 bg-white px-4 h-11"
          />
        </label>

        {/* タイトル */}
        <label className="mt-6 block">
          <span className="text-sm font-semibold text-slate-800">
            求人タイトル
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="例: フロントエンドエンジニア"
            className="mt-2 block w-full border border-slate-300 bg-white px-4 h-11"
          />
        </label>

        {/* 仕事内容 (description) 👈 追加 */}
        <label className="mt-6 block">
          <span className="text-sm font-semibold text-slate-800">仕事内容</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="例: React/TypeScript を用いたフロントエンド開発業務"
            className="mt-2 block w-full border border-slate-300 bg-white px-4 h-24"
          />
        </label>

        <div className="mt-8">
          <button
            type="submit"
            className="inline-block bg-sky-600 hover:bg-sky-700 text-white px-12 py-3 rounded-md"
          >
            投稿
          </button>
        </div>
      </form>
    </div>
  );
}
