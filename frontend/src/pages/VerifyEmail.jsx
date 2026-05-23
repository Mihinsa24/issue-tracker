import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const verify = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        return;
      }
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        // Auto redirect to login after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setStatus("error");
      }
    };
    verify();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <p className="text-4xl mb-4">⏳</p>
            <h2 className="text-xl font-bold text-slate-800">Verifying your email...</h2>
          </>
        )}
        {status === "success" && (
          <>
            <p className="text-4xl mb-4">🎉</p>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Email Verified!</h2>
            <p className="text-slate-500 mb-4">Your account is now active.</p>
            <p className="text-slate-400 text-sm mb-6">Redirecting to login in 3 seconds...</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer border-none"
            >
              Go to Login Now
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-4xl mb-4">❌</p>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Verification Failed</h2>
            <p className="text-slate-500 mb-6">The link is invalid or has expired.</p>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer border-none"
            >
              Register Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;