import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import customFetch from "../utils/customFetch";
import { 
  Menu as MenuIcon, 
  Close as CloseIcon, 
  Dashboard as DashboardIcon, 
  TrendingUp as IncomeIcon, 
  AccountBalanceWallet as AccountIcon, 
  SwapHoriz as TransferIcon, 
  MoneyOff as ExpenseIcon, 
  Logout as LogoutIcon 
} from "@mui/icons-material";

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // 🔓 Logout Function
  const handleLogout = async () => {
    try {
      await customFetch.post("/auth/logout");

      // redirect to login
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
    { path: "/admin/income", label: "Income", icon: <IncomeIcon fontSize="small" /> },
    { path: "/admin/account", label: "Account", icon: <AccountIcon fontSize="small" /> },
    { path: "/admin/transfer", label: "Transfer", icon: <TransferIcon fontSize="small" /> },
    { path: "/admin/expense", label: "Expense", icon: <ExpenseIcon fontSize="small" /> },
  ];

  return (
    <>
      {/* 🔥 Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-3 left-4 z-50 bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700/50 shadow-md cursor-pointer flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
      </button>

      {/* 🔥 Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs md:hidden z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 🔥 Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col z-40 transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Logo/Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-600/20">
              <AccountIcon fontSize="small" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Finance Admin
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? "bg-indigo-650 text-white shadow-md shadow-indigo-650/15"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 🔥 Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white py-3 px-4 rounded-xl font-medium text-sm border border-rose-500/10 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <LogoutIcon fontSize="small" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;