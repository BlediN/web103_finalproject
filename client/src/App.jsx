import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import SubmitEntryPage from "./pages/SubmitEntryPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
        
        <h2 style={{ padding: "1rem 0" }}>LayoffLens</h2>

        <nav
          style={{
            display: "flex",
            gap: "1rem",
            padding: "1rem 0",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Link to="/">Feed</Link>
          <Link to="/submit">Submit Entry</Link>
        </nav>

        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/submit" element={<SubmitEntryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
