import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "your email";
  const [checking, setChecking] = useState(false);

  // Poll every 3 seconds to check if user has verified
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.post("/auth/check-verified", { email });
        if (res.data.isVerified) {
          clearInterval(interval);
          navigate("/login", { 
            state: { message: "Email verified! You can now log in." } 
          });
        }
      } catch (err) {
        // keep polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [email]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <p className="text-5xl mb-4">📧</p>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Check your email!</h2>
        <p className="text-slate-500 mb-2">We sent a verification link to:</p>
        <p className="font-semibold text-indigo-600 mb-6">{email}</p>

        {/* Animated waiting indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          Waiting for verification... Once you click the link in your email, 
          you'll be automatically redirected to login.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
          <p className="text-amber-700 text-sm">
            ⚠️ Can't find the email? Check your spam folder.
          </p>
        </div>
        <button
            onClick={() => navigate("/register")}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-semibold cursor-pointer border-none"
        >
            Back to Register
        </button>
      </div>
    </div>
  );
}

export default CheckEmail;