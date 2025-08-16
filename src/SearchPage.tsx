import { useEffect, useMemo, useState } from "react";
import { categories, salarySteps, JOBS } from "./jobs";
import type { Category } from "./job";

/* ========= 求人検索ページ ========= */
export function SearchPage() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [minSalary, setMinSalary] = useState<number>(300);// 万円

  const toggleCategory = (c: Category) =>
    setSelectedCategories((prev) =>
      prev.includes(c) 
    ? prev.filter((x) => x !== c) //すでに選択されていたら外す
    : [...prev, c] //選択されていなければ追加
    );

  const pageSize = 10;
  const [page, setPage] = useState(1); //現在のページ番号

  const filtered = useMemo(() => {
    const byCat = selectedCategories.length
      ? JOBS.filter((j) => selectedCategories.includes(j.category)) //1つでも選択したら絞り込んで表示
      : JOBS;
    return byCat.filter((j) => j.salary >= minSalary);
  }, [selectedCategories, minSalary]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)); //ページ数の計算
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize); //表示する求人を切り出す

    // フィルタ変更時は1ページ目へ戻す
  useEffect(() => { setPage(1); }, [selectedCategories, minSalary]);
    /* ========= サイドバー、求人一覧 =========*/
  return (
    <div className="flex w-full">
        {/* 職種チェックボックス */}
      <aside className="w-64 shrink-0 bg-gray-200 p-4 pt-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-sm font-semibold text-slate-700">求人カテゴリ</p>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <input
                  id={`cat-${c}`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  checked={selectedCategories.includes(c)}
                  onChange={() => toggleCategory(c)}  //変更があった場合、この関数が呼ばれる
                />
                <label htmlFor={`cat-${c}`} className="text-sm">{c}</label>
              </li>
            ))}
          </ul>

          {/* 年収の選択フォーム */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-slate-700">年収</p>
            <select
              className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm"
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))} //数値型に変換して更新
            >
              {salarySteps.map((v) => (
                <option key={v} value={v}>
                  {v === 1000 ? "1000万円以上" : `${v}万円以上`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      {/* 求人一覧 */}
      <main className="flex-1 px-4 md:px-6 py-6">
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-semibold">求人一覧</h2>
          <p className="mt-1 text-xs md:text-sm text-slate-500">該当件数: {filtered.length}件</p>
        </div>

        <section className="grid gap-4">
        {/*絞り込み、ページ分割が完了している配列を表示*/}
          {paged.map((job) => (
            <article key={job.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base md:text-lg font-semibold leading-snug">{job.title}</h3>
              <div className="mt-2 text-sm text-slate-500">
                <p>カテゴリ：{job.category}</p>
                <p>年収：{job.salary}万円</p>
              </div>
            </article>
          ))}
        </section>

        {/* ページネーション */}
        <div className="mt-6 flex items-center justify-center gap-3 text-base select-none">
          <button
            className="disabled:opacity-30" //押せないときは暗くする
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ◀
          </button>
          {/* ページ番号 */}
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={p === page ? "font-bold" : ""}  //現在のページは太字にする
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ))}
          {/* 次へ */}
          <button
            className="disabled:opacity-30"
            disabled={page === pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            ▶
          </button>
        </div>
      </main>
    </div>
  );
}
