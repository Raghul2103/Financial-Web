import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon, 
  FilterAlt as FilterIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon 
} from "@mui/icons-material";

const ExpenseList = ({
  expenseList,
  accounts,
  filters,
  setFilters,
  totalPages,
  onDelete,
  onEdit,
}) => {

  // ✅ PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    const data = expenseList.map(e => [
      new Date(e.date).toLocaleDateString(),
      e.accountId?.name,
      e.category,
      e.amount,
      e.note
    ]);

    autoTable(doc, {
      head: [["Date","Account","Category","Amount","Note"]],
      body: data,
    });

    doc.save("expense.pdf");
  };

  // ✅ Excel
  const exportExcel = () => {
    const data = expenseList.map(e => ({
      Date: new Date(e.date).toLocaleDateString(),
      Account: e.accountId?.name,
      Category: e.category,
      Amount: e.amount,
      Note: e.note
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expense");
    XLSX.writeFile(wb, "expense.xlsx");
  };

  return (
    <div className="space-y-4">
      {/* FILTER PANEL */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <FilterIcon fontSize="inherit" className="text-slate-400" />
            Filter Expenses
          </h3>

          {/* EXPORT BUTTONS */}
          <div className="flex gap-2">
            <button 
              onClick={exportPDF}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100 cursor-pointer transition-colors duration-150"
            >
              <PdfIcon fontSize="inherit" />
              PDF
            </button>
            <button 
              onClick={exportExcel}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100 cursor-pointer transition-colors duration-150"
            >
              <ExcelIcon fontSize="inherit" />
              Excel
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <select 
            className="border border-slate-200/80 rounded-xl p-2 bg-slate-50/50 cursor-pointer text-sm focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
            value={filters.accountId}
            onChange={(e)=>setFilters({...filters,accountId:e.target.value})}
          >
            <option value="">All Accounts</option>
            {accounts.map(a=>(
              <option key={a._id} value={a._id}>{a.name}</option>
            ))}
          </select>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400">
              <SearchIcon fontSize="inherit" />
            </span>
            <input 
              placeholder="Category..."
              className="border border-slate-200/80 rounded-xl pl-8 pr-2 py-2 bg-slate-50/50 text-sm w-full focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
              value={filters.category}
              onChange={(e)=>setFilters({...filters,category:e.target.value})}
            />
          </div>

          <input 
            type="date"
            className="border border-slate-200/80 rounded-xl p-2 bg-slate-50/50 text-sm focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
            value={filters.startDate}
            onChange={(e)=>setFilters({...filters,startDate:e.target.value})}
          />

          <input 
            type="date"
            className="border border-slate-200/80 rounded-xl p-2 bg-slate-50/50 text-sm focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
            value={filters.endDate}
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
              {expenseList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400 text-sm">
                    No expenses logged.
                  </td>
                </tr>
              ) : (
                expenseList.map(e=>(
                  <tr key={e._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-5 py-4 text-slate-650 text-sm">
                      {new Date(e.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800 text-sm">{e.accountId?.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5">Balance: ₹{e.accountId?.balance?.toLocaleString()}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                        {e.category}
                      </span>
                      {e.note && <div className="text-slate-400 text-xs mt-1 italic font-light">{e.note}</div>}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-rose-650 text-sm">
                      -₹{e.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="inline-flex gap-1 justify-center">
                        <button
                          onClick={()=>onEdit(e)}
                          className="p-1.5 text-blue-550 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={()=>onDelete(e._id)}
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
                    ? "bg-rose-600 border-rose-600 text-white shadow-xs"
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
  );
};

export default ExpenseList;