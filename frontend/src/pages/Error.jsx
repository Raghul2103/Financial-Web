import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { WarningAmber as WarningIcon } from "@mui/icons-material";

const Error = () => {
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await customFetch.get("/auth/me");
        setStatus("authenticated");
      } catch {
        setStatus("unauthenticated");
      }
    };

    checkAuth();
  }, []);

  if (status === "loading") {
    return (
      <div className="h-screen flex flex-col gap-3 items-center justify-center bg-slate-950 text-slate-400 font-medium text-sm">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-550 rounded-full animate-spin"></div>
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden px-4">
      {/* Decorative Blur */}
      <div className="absolute w-72 h-72 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-sm">
        <div className="bg-rose-500/10 text-rose-500 p-4 rounded-2xl w-fit mx-auto mb-5 border border-rose-500/20 animate-bounce">
          <WarningIcon fontSize="large" />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-lg font-semibold text-slate-350 mb-3">
          Page Not Found
        </h2>
        <p className="text-slate-550 text-sm mb-6 leading-relaxed">
          The link you followed might be broken, or the page may have been removed. Let's get you back on track.
        </p>

        <button
          onClick={() =>
            navigate(status === "authenticated" ? "/admin" : "/login")
          }
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-750 hover:from-indigo-500 hover:to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-indigo-600/20 active:scale-[0.98] cursor-pointer transition-all duration-200 text-sm"
        >
          Go to {status === "authenticated" ? "Dashboard" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Error;