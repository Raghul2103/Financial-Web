import { useEffect, useState } from "react";
import { AddCircleOutline as AddIcon, Update as UpdateIcon } from "@mui/icons-material";

const ExpenseForm = ({ accounts, onSubmit, editData }) => {
  const [form, setForm] = useState({
    amount: "",
    accountId: "",
    category: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  // 🔁 Load edit data
  useEffect(() => {
    if (editData) {
      setForm({
        amount: editData.amount,
        accountId: editData.accountId?._id,
        category: editData.category,
        note: editData.note,
        date: editData.date.split("T")[0],
      });
    }
  }, [editData]);

  const resetForm = () => {
    setForm({
      amount: "",
      accountId: "",
      category: "",
      note: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, resetForm);
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs">
      <h2 className="text-md font-bold text-slate-700 mb-4 flex items-center gap-2">
        {editData ? <UpdateIcon className="text-rose-650" fontSize="small" /> : <AddIcon className="text-rose-650" fontSize="small" />}
        {editData ? "Update Expense" : "Add Expense"}
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-slate-600 text-sm font-medium mb-1">Amount (₹)</label>
          <input 
            type="number" 
            placeholder="0"
            className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-sm"
            value={form.amount}
            onChange={(e)=>setForm({...form,amount:e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-slate-600 text-sm font-medium mb-1">Account</label>
          <select 
            className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white cursor-pointer focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-sm"
            value={form.accountId}
            onChange={(e)=>setForm({...form,accountId:e.target.value})}
            required
          >
            <option value="">Select Source</option>
            {accounts.map(a=>(
              <option key={a._id} value={a._id}>
                {a.name} (₹{a.balance})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-600 text-sm font-medium mb-1">Category</label>
          <input 
            type="text"
            placeholder="e.g. Food, Rent, Entertainment"
            className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-sm"
            value={form.category}
            onChange={(e)=>setForm({...form,category:e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-slate-600 text-sm font-medium mb-1">Date</label>
          <input 
            type="date" 
            className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-sm"
            value={form.date}
            onChange={(e)=>setForm({...form,date:e.target.value})}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-slate-600 text-sm font-medium mb-1">Note (Optional)</label>
          <input 
            type="text"
            placeholder="Brief description"
            className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-sm"
            value={form.note}
            onChange={(e)=>setForm({...form,note:e.target.value})}
          />
        </div>

        <button className="w-full bg-gradient-to-r from-rose-600 to-red-650 hover:from-rose-550 hover:to-rose-600 text-white p-2.5 rounded-xl font-semibold shadow-md shadow-rose-600/10 active:scale-[0.98] cursor-pointer md:col-span-2 text-sm mt-1">
          {editData ? "Update" : "Add"} Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;