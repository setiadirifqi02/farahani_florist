import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import { Toaster } from "react-hot-toast";
import userRoutes from "./components/route/userRoutes";
import adminRoutes from "./components/route/adminRoutes";
import NotFound from "./components/layout/NotFound";
import AboutUs from "./components/AboutUs";
import Footer from "./components/layout/Footer";

export default function App() {
  const useUserRoutes = userRoutes();
  const useAdminRoutes = adminRoutes();
  return (
    <Router>
      <div className="app_container flex flex-col justify-center items-center">
        <Toaster position="top-center" />
        <Header />
        <Routes>
          {useUserRoutes}
          {useAdminRoutes}
          <Route path="*" element={<NotFound />} />
          <Route path="/about_us" element={<AboutUs />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
