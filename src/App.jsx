import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Intro from "./components/Intro";

import Home from "./pages/Home";
import VehicleDetails from "./pages/VehicleDetails";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminVehicles from "./pages/AdminVehicles";

function AppContent() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  const [showIntro, setShowIntro] = useState(
    () =>
      !sessionStorage.getItem("fastImportIntroSeen") &&
      location.pathname === "/",
  );

  const handleEnter = () => {
    sessionStorage.setItem("fastImportIntroSeen", "true");
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <Intro onEnter={handleEnter} />}

      {!isAdminPage && !showIntro && <Navbar />}

      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/login" element={<Login />} />

        {/* Pages administrateur, sans navbar */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/vehicles" element={<AdminVehicles />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
