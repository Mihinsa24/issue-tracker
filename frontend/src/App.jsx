import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IssueList from "./pages/IssueList";
import IssueDetail from "./pages/IssueDetail";
import CreateIssue from "./pages/CreateIssue";
import EditIssue from "./pages/EditIssue";
import { Toaster } from "react-hot-toast";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const { token } = useAuthStore();

  return (
    <>
      <Toaster position="top-right" />
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <IssueList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/:id"
          element={
            <ProtectedRoute>
              <IssueDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/new"
          element={
            <ProtectedRoute>
              <CreateIssue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/:id/edit"
          element={
            <ProtectedRoute>
              <EditIssue />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;