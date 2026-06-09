import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../Sidebar";

const AdminLayout = () => {
  const isLoggedIn = true; // 🔥 replace later

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
        {/* Top Header Navbar */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 bg-white border-b border-slate-200/80 shadow-xs z-10">
          <div className="pl-12 md:pl-0">
            <h2 className="text-base md:text-lg font-semibold text-slate-800">
              Finance Hub
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">
              Admin Session
            </span>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;