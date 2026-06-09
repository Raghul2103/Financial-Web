import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch.js";
import { toast } from "react-toastify";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  AccountBalance as BankIcon, 
  Payments as CashIcon, 
  AddCircleOutline as AddIcon,
  Update as UpdateIcon 
} from "@mui/icons-material";

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "bank",
    balance: "",
    note: "",
  });

  const fetchAccounts = async () => {
    const res = await customFetch.get("/accounts");
    setAccounts(res.data.data || res.data);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...form, balance: Number(form.balance) };

      if (editId) {
        await customFetch.put(`/accounts/${editId}`, payload);
        toast.success("Updated");
        setEditId(null);
      } else {
        await customFetch.post("/accounts", payload);
        toast.success("Added");
      }

      setForm({ name: "", type: "bank", balance: "", note: "" });
      fetchAccounts();
    } catch {
      toast.error("Error");
    }
  };

  const handleDelete = async (id) => {
    await customFetch.delete(`/accounts/${id}`);
    toast.success("Deleted");
    fetchAccounts();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Accounts</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage bank holdings and physical cash wallets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* FORM CONTAINER */}
        <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs">
          <h2 className="text-md font-bold text-slate-700 mb-4 flex items-center gap-2">
            {editId ? <UpdateIcon className="text-indigo-650" fontSize="small" /> : <AddIcon className="text-indigo-650" fontSize="small" />}
            {editId ? "Update Account" : "Add Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Name</label>
              <input 
                type="text"
                placeholder="e.g. HDFC Salary, Pocket Cash"
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm" 
                value={form.name}
                onChange={(e)=>setForm({...form,name:e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Type</label>
              <select 
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white cursor-pointer focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm"
                value={form.type}
                onChange={(e)=>setForm({...form,type:e.target.value})}
              >
                <option value="bank">Bank</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Balance (₹)</label>
              <input 
                type="number" 
                placeholder="0"
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm"
                value={form.balance}
                onChange={(e)=>setForm({...form,balance:e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Note (Optional)</label>
              <input 
                type="text"
                placeholder="e.g. Primary savings card"
                className="border border-slate-200/80 rounded-xl p-2.5 w-full bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm"
                value={form.note}
                onChange={(e)=>setForm({...form,note:e.target.value})}
              />
            </div>

            <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white p-2.5 rounded-xl font-semibold shadow-md shadow-emerald-600/10 active:scale-[0.98] cursor-pointer mt-2 text-sm">
              {editId ? "Update" : "Add"} Account
            </button>
          </form>
        </div>

        {/* LIST CONTAINER / TABLE */}
        <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-md font-bold text-slate-700">Account Summary</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase bg-slate-50/30">
                  <th className="px-6 py-4">Account Details</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Balance</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400 text-sm">
                      No accounts found. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  accounts.map(a => (
                    <tr key={a._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 text-sm">{a.name}</div>
                        {a.note && <div className="text-slate-400 text-xs mt-0.5 font-light">{a.note}</div>}
                      </td>
                      <td className="px-6 py-4">
                        {a.type === "bank" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                            <BankIcon fontSize="inherit" />
                            Bank
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100">
                            <CashIcon fontSize="inherit" />
                            Cash
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800 text-sm">
                        ₹{a.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex gap-1.5 justify-center">
                          <button 
                            onClick={()=>{setForm(a);setEditId(a._id)}} 
                            className="p-1.5 text-blue-550 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer"
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button 
                            onClick={()=>handleDelete(a._id)} 
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
        </div>
      </div>
    </div>
  );
};

export default Account;