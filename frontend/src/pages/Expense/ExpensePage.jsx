import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch.js";
import { toast } from "react-toastify";
import ExpenseForm from "../../component/Expense/ExpenseForm.jsx";
import ExpenseList from "../../component/Expense/ExpenseList.jsx";

const ExpensePage = () => {
  const [accounts, setAccounts] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [editData, setEditData] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    accountId: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch Accounts
  const fetchAccounts = async () => {
    const res = await customFetch.get("/accounts");
    setAccounts(res.data.data || res.data);
  };

  // 🔹 Fetch Expense
  const fetchExpense = async () => {
    const res = await customFetch.get("/transactions/expense", {
      params: filters,
    });
    setExpenseList(res.data.data);
    setTotalPages(res.data.pages);
  };

  useEffect(() => { fetchAccounts(); }, []);
  useEffect(() => { fetchExpense(); }, [filters]);

  // ✅ Add / Update
  const handleSubmit = async (form, resetForm) => {
    const payload = { ...form, amount: Number(form.amount) };

    try {
      if (editData) {
        await customFetch.put(`/transactions/expense/${editData._id}`, payload);
        toast.success("Updated");
        setEditData(null);
      } else {
        await customFetch.post("/transactions/expense", payload);
        toast.success("Added");
      }

      resetForm();
      fetchExpense();
      fetchAccounts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    await customFetch.delete(`/transactions/expense/${id}`);
    toast.success("Deleted");
    fetchExpense();
    fetchAccounts();
  };

  return (
    <div className="p-6 space-y-6">
      <ExpenseForm
        accounts={accounts}
        onSubmit={handleSubmit}
        editData={editData}
      />

      <ExpenseList
        expenseList={expenseList}
        accounts={accounts}
        filters={filters}
        setFilters={setFilters}
        totalPages={totalPages}
        onDelete={handleDelete}
        onEdit={setEditData}
      />
    </div>
  );
};

export default ExpensePage;