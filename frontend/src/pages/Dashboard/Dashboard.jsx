import { 
  AccountBalance as AccountIcon, 
  TrendingUp as IncomeIcon, 
  TrendingDown as ExpenseIcon, 
  SwapHoriz as TransferIcon,
  ArrowForward as ArrowIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    {
      title: "Accounts Overview",
      desc: "Manage bank accounts and cash flow systems.",
      path: "/admin/account",
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20",
      icon: <AccountIcon fontSize="medium" />
    },
    {
      title: "Incomes & Deposits",
      desc: "Record financial deposits and revenue stream inflows.",
      path: "/admin/income",
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-500/20",
      icon: <IncomeIcon fontSize="medium" />
    },
    {
      title: "Expenses & Outflow",
      desc: "Track custom categories, receipts, and spending habits.",
      path: "/admin/expense",
      color: "from-rose-500/10 to-orange-500/10 text-rose-600 border-rose-500/20",
      icon: <ExpenseIcon fontSize="medium" />
    },
    {
      title: "Fund Transfers",
      desc: "Shift assets between balance-sheets instantly.",
      path: "/admin/transfer",
      color: "from-purple-500/10 to-fuchsia-500/10 text-purple-600 border-purple-500/20",
      icon: <TransferIcon fontSize="medium" />
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-900/10">
        <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[200%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 mb-4 border border-indigo-400/20">
            System Live
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Welcome back, Admin 👋
          </h1>
          <p className="text-slate-350 text-sm sm:text-base leading-relaxed">
            Here is an overview of your financial management tools. Navigate through the cards below or use the sidebar menu to log and analyze transactions.
          </p>
        </div>
      </div>

      {/* Main Operations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx}
            className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-slate-300/85 transition-all duration-250 flex flex-col justify-between group"
          >
            <div>
              <div className={`p-3 rounded-xl w-fit bg-gradient-to-tr ${stat.color} border mb-4`}>
                {stat.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors duration-200">
                {stat.title}
              </h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                {stat.desc}
              </p>
            </div>
            
            <Link 
              to={stat.path}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-650 hover:text-indigo-700 transition-colors duration-200 group-hover:translate-x-0.5 cursor-pointer"
            >
              Access panel
              <ArrowIcon fontSize="inherit" className="transition-transform duration-205" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;