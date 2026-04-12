import React, { useState } from "react";
import icon from "../../assets/user-gear.png";
import modalBg from "../../assets/loginPost.jpg";
import { loginUser } from "./authService";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Alert from "../../components/alerts/Alert";
import { LockIcon } from "lucide-react";

const Login = () => {
  const { isAuthenticated, checkAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);


  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginUser(email, password);

    if (result.success) {
      setSuccessMessage(result.message);
      await checkAuth();
    } else {
      setErrorMessage(result.message);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-bgPrimary relative"
    // style={{ backgroundImage: `url(${modalBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-bgPrimary/80 backdrop-blur-md shadow-2xl rounded p-8 animate-fadeIn">
        {/* Branding */}
        <div className="flex flex-col items-center mb-6">
          <img src={icon} alt="logo" className="h-16 mb-2 drop-shadow-md" />
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
            HamroAwaz Admin
          </h1>
          <p className="text-sm text-gray-600">Sign in to continue</p>
        </div>

        {/* Form */}
        <form className="space-y-6 text-[16px]" onSubmit={handleLogin}>
          {/* Email */}
          <div className="relative w-full">
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                peer block w-full px-3 pt-5 pb-2 text-gray-900 
                bg-white border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#1F8A3A]/30 
                focus:border-secondary transition
              "
            />
            <label
              htmlFor="email"
              className="
                absolute left-3 top-2 px-1 bg-white text-gray-500 text-sm 
                transition-all duration-200 pointer-events-none
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-secondary
              "
            >
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative w-full">
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                peer block w-full px-3 pt-5 pb-2 text-gray-900 
                bg-white border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#1F8A3A]/30 
                focus:border-secondary transition
              "
            />
            <label
              htmlFor="password"
              className="
                absolute left-3 top-2 px-1 bg-white text-gray-500 text-sm 
                transition-all duration-200 pointer-events-none
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-secondary
              "
            >
              Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
    w-full py-3 text-white text-[17px] font-semibold 
    rounded-lg shadow-md transition duration-300 cursor-pointer
    bg-primary
   hover:bg-secondary
    disabled:opacity-60 disabled:cursor-not-allowed
  `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>


          {/* Footer */}
          <p className="text-center text-[14px] text-gray-700 opacity-80 mt-4">
            © {new Date().getFullYear()} HamroAwaz — All Rights Reserved
          </p>
        </form>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          duration={1200}
          onClose={() => setErrorMessage("")}
        />
      )}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          duration={1200}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </div>
  );
};

export default Login;
