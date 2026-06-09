import { useState } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch.js";
import { Email, Lock, Login as LoginIcon } from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await customFetch.post("/auth/login", form);

      navigate("/admin"); // ✅ redirect
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="glass-panel p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 mx-4">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-indigo-600/10 p-3 rounded-full mb-3 text-indigo-400">
          <LoginIcon fontSize="large" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Sign in to your Finance Admin Dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Email fontSize="small" />
            </span>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
              onChange={handleChange}
              value={form.email}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock fontSize="small" />
            </span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] cursor-pointer">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;