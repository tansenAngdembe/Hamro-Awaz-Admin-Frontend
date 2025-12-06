import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./features/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import "./styles/App.css";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import SetPasswordScreen from "./screens/SetPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<SetPasswordScreen />} path="/setPassword/:uniqueId" />
        <Route
          element={<ResetPasswordScreen />}
          path="/resetPassword/:uniqueId"
        />
        <Route element={<ProtectedRoutes />}>
          <Route element={<Dashboard />} path="/*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
