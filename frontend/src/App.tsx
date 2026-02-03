import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainAppPage from "./pages/MainAppPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<MainAppPage />} />
        <Route path="/dashboard" element={<MainAppPage />} />
        <Route path="/requisitions" element={<MainAppPage />} />
        <Route path="/purchases" element={<MainAppPage />} />
        <Route path="/payments" element={<MainAppPage />} />
        <Route path="/contract-tracking" element={<MainAppPage />} />
        <Route path="/expense-details" element={<MainAppPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
