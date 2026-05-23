import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

// Application navigation bar shown when the user is authenticated.
function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-700 text-black px-4 py-3">
      <div className="max-w-7.5xl mx-auto flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-white font-bold text-xl no-underline">
            🐛 Tracer
          </Link>
          <div className="flex gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md text-md font-medium no-underline transition-colors ${
                isActive("/")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/issues"
              className={`px-3 py-1.5 rounded-md text-md font-medium no-underline transition-colors ${
                isActive("/issues")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Issues
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300 text-md text-black">👤 {user?.name}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-md font-semibold cursor-pointer border-none"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;