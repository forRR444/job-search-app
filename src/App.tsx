import './App.css'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Header from "./Header";
import {SearchPage} from "./SearchPage";
import {PostPage} from "./PostPage";



/* ========= アプリ ========= */
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen ">
        <Header />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/post" element={<PostPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
