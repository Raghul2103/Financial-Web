import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch.js";
import { toast } from "react-toastify";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon, 
  FilterAlt as FilterIcon,
  AddCircleOutline as AddIcon,
  Update as UpdateIcon 
} from "@mui/icons-material";

const Income = () => {
  const [accounts, setAccounts] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [editId, setEditId] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    accountId: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    amount: "",
    accountId: "",
    category: "",
    note: "",
    date: "",
  });

  const fetchAccounts = async () => {
    const res = await customFetch.get("/accounts");
    setAccounts(res.data.data || res.data);
  };

  const fetchIncome = async () => {
    const res = await customFetch.get("/transactions/income", {
      params: filters,
    });
    setIncomeList(res.data.data);
    setTotalPages(res.data.pages);
  };

  useEffect(() => { fetchAccounts(); }, []);
  useEffect(() => { fetchIncome(); }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form, amount: Number(form.amount) };

    try {
      if (editId) {
        await customFetch.put(`/transactions/${editId}`, payload);
        toast.success("Updated");
        setEditId(null);
      } else {
        await customFetch.post("/transactions/income", payload);
        toast.success("Added");
      }

      setForm({ amount: "", accountId: "", category: "", note: "", date: "" });
      fetchIncome();
      fetchAccounts();
    } catch {
      toast.error("Error");
    }
  };

  const handleDelete = async (id) => {
    await customFetch.delete(`/transactions/${id}`);
    toast.success("Deleted");
    fetchIncome();
    fetchAccounts(); // also fetch accounts in case balance changes
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Income Log</h1>
        <p className="text-slate-500 text-sm mt-0.5">Record capital deposits, wages, and other cash inflow streams</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* FORM CONTAINER */}
        <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs">
          <h2 className="text-md font-bold text-slate-700 mb-4 flex items-center gap-2">
            {editId ? <UpdateIcon className="text-blue-650" fontSize="small" /> : <AddIcon className="text-blue-650" fontSize="small" />}
            {editId ? "Update Income" : "Add Income"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Amount (₹)</label>
              <input 
                type="number" 
                placeholder="0"
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
                value={form.amount}
                onChange={(e)=>setForm({...form,amount:e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Account</label>
              <select 
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white cursor-pointer focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
                value={form.accountId}
                onChange={(e)=>setForm({...form,accountId:e.target.value})}
                required
              >
                <option value="">Select Destination</option>
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
                placeholder="e.g. Salary, Freelance, Gift"
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
                value={form.category}
                onChange={(e)=>setForm({...form,category:e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Date</label>
              <input 
                type="date" 
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
                value={form.date ? form.date.split("T")[0] : ""}
                onChange={(e)=>setForm({...form,date:e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Note (Optional)</label>
              <input 
                type="text"
                placeholder="Brief description"
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
                value={form.note}
                onChange={(e)=>setForm({...form,note:e.target.value})}
              />
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-2.5 rounded-xl font-semibold shadow-md shadow-blue-600/10 active:scale-[0.98] cursor-pointer mt-2 text-sm">
              {editId ? "Update" : "Add"} Income
            </button>
          </form>
        </div>

        {/* LIST CONTAINER */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* FILTERS PANEL */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              <FilterIcon fontSize="inherit" className="text-slate-400" />
              Filter Deposits
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <select 
                className="border border-slate-200/80 rounded-xl p-2 bg-slate-50/50 cursor-pointer text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                onChange={(e)=>setFilters({...filters,accountId:e.target.value})}
              >
                <option value="">All Accounts</option>
                {accounts.map(a=> <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400">
                  <SearchIcon fontSize="inherit" />
                </span>
                <input 
                  placeholder="Category..."
                  className="border border-slate-200/80 rounded-xl pl-8 pr-2 py-2 bg-slate-50/50 text-sm w-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  onChange={(e)=>setFilters({...filters,category:e.target.value})}
                />
              </div>

              <input 
                type="date"
                className="border border-slate-200/80 rounded-xl p-2 bg-slate-50/50 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                onChange={(e)=>setFilters({...filters,startDate:e.target.value})}
              />

              <input 
                type="date"
                className="border border-slate-200/80 rounded-xl p-2 bg-slate-50/50 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                onChange={(e)=>setFilters({...filters,endDate:e.target.value})}
              />
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase bg-slate-50/30">
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Account</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4 text-right">Amount</th>
                    <th className="px-5 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {incomeList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-400 text-sm">
                        No deposits found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    incomeList.map(i=>(
                      <tr key={i._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                        <td className="px-5 py-4 text-slate-650 text-sm">
                          {new Date(i.date).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800 text-sm">{i.accountId?.name}</div>
                          <div className="text-slate-400 text-xs mt-0.5">Balance: ₹{i.accountId?.balance?.toLocaleString()}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {i.category}
                          </span>
                          {i.note && <div className="text-slate-400 text-xs mt-1 italic font-light">{i.note}</div>}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-emerald-650 text-sm">
                          +₹{i.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex gap-1 justify-center">
                            <button
                              onClick={()=>{setForm({...i,accountId:i.accountId?._id});setEditId(i._id)}}
                              className="p-1.5 text-blue-550 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer"
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </button>
                            <button
                              onClick={()=>handleDelete(i._id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-650 rounded-lg cursor-pointer"
                              title="Delete"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION PANEL */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center py-4 px-5 bg-slate-50/40 border-t border-slate-100 gap-1.5">
                {[...Array(totalPages).keys()].map(p=>(
                  <button 
                    key={p}
                    onClick={()=>setFilters({...filters,page:p+1})}
                    className={`px-3 py-1.5 border text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                      filters.page===p+1
                        ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-100 text-slate-650"
                    }`}
                  >
                    {p+1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;