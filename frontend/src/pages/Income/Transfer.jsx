import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch.js";
import { toast } from "react-toastify";
import { 
  SwapHoriz as TransferIcon,
  East as ArrowRightIcon,
  South as ArrowDownIcon,
  Send as SendIcon 
} from "@mui/icons-material";

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);

  const [form, setForm] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    note: "",
  });

  // 🔹 FETCH ACCOUNTS (same as before)
  const fetchAccounts = async () => {
    try {
      const res = await customFetch.get("/accounts");
      setAccounts(res.data.data || res.data);
    } catch {
      toast.error("Failed to load accounts");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // 🔥 FIXED SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.fromAccountId === form.toAccountId) {
      return toast.error("Same account not allowed");
    }

    try {
      await customFetch.post("/transactions/transfer", {
        ...form,
        amount: Number(form.amount), // already correct
      });

      toast.success("Transfer successful");

      // ✅ 1. RESET FORM (UX FIX)
      setForm({
        fromAccountId: "",
        toAccountId: "",
        amount: "",
        note: "",
      });

      // ✅ 2. REFRESH ACCOUNTS (MAIN FIX)
      fetchAccounts();

    } catch {
      toast.error("Transfer failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Transfer Funds</h1>
        <p className="text-slate-500 text-sm mt-0.5">Move assets and re-allocate capital between accounts</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form
          className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="bg-purple-550/15 p-2 rounded-xl text-purple-600">
              <TransferIcon fontSize="medium" />
            </div>
            <div>
              <h2 className="text-md font-bold text-slate-700">Internal Asset Transfer</h2>
              <p className="text-slate-400 text-xs font-light">Values will update in real-time across both accounts</p>
            </div>
          </div>

          {/* Account Route Selection (Visual Block) */}
          <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
            {/* FROM */}
            <div className="md:col-span-5">
              <label className="block text-slate-650 text-xs font-semibold uppercase tracking-wider mb-1.5">From Account</label>
              <select
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-white cursor-pointer text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                value={form.fromAccountId}
                onChange={(e) =>
                  setForm({ ...form, fromAccountId: e.target.value })
                }
                required
              >
                <option value="">Select Source</option>
                {accounts.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name} (₹{a.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* FLOW INDICATOR ARROW */}
            <div className="md:col-span-1 flex justify-center text-slate-400">
              <span className="hidden md:inline-block">
                <ArrowRightIcon fontSize="large" className="text-purple-650" />
              </span>
              <span className="md:hidden">
                <ArrowDownIcon fontSize="large" className="text-purple-650" />
              </span>
            </div>

            {/* TO */}
            <div className="md:col-span-5">
              <label className="block text-slate-650 text-xs font-semibold uppercase tracking-wider mb-1.5">To Account</label>
              <select
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-white cursor-pointer text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                value={form.toAccountId}
                onChange={(e) =>
                  setForm({ ...form, toAccountId: e.target.value })
                }
                required
              >
                <option value="">Select Destination</option>
                {accounts.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name} (₹{a.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount and Note grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* AMOUNT */}
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Amount (₹)</label>
              <input
                type="number"
                placeholder="0"
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-sm"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                required
              />
            </div>

            {/* NOTE */}
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Note (Optional)</label>
              <input
                type="text"
                placeholder="Transfer details"
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-sm"
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
              />
            </div>
          </div>

          <button className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-purple-600/10 active:scale-[0.98] cursor-pointer mt-2 text-sm">
            <SendIcon fontSize="inherit" />
            Initiate Transfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;