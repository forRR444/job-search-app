import {NavLink} from "react-router-dom";
/* ========= 共通ヘッダー ========= */
export default function Header() {
  return (
    <header className="bg-slate-800 text-white">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <div className="text-lg font-bold">求人検索アプリ</div>
        <nav className="flex gap-6">
          <NavLink to="/" end className="hover:underline aria-[current=page]:font-semibold">
            求人検索
          </NavLink>
          <NavLink to="/post" className="hover:underline aria-[current=page]:font-semibold">
            求人投稿
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
