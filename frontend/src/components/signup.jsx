import React,{ useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom"
import { registerUser } from "../slices/authSlice";
import { validate } from "../utils/validation";

function Signup() {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({})
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.userInfo)

  if (user) return <Navigate to={'/'} replace />
  function handleChange(e) {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate(userData, {
        usernameRequired: true,
        emailRequired: true,
        passwordRequired: true
    });

    if (Object.keys(validationError).length > 0) {
        setErrors(validationError);
        return;
    }

    const result = await dispatch(registerUser(userData));

    if (registerUser.fulfilled.match(result)) {
        navigate('/');
    } else {
        const payload = result.payload;

        if (typeof result.payload === 'object') {
          if (result.payload.message) {
            setErrors({ errorMessage: result.payload.message });
          } else {
            setErrors(result.payload);
          }
        } else {
          setErrors({ errorMessage: 'Unknown error occurred' });
        }

    }
};


  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 relative">
      {/* Floating visuals */}
      <div className="absolute top-32 right-32 w-32 h-32 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-32 left-32 w-36 h-36 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-30 animate-bounce"></div>

      {/* Card */}
      <div className="w-full max-w-md backdrop-blur-sm bg-white/90 border-0 shadow-2xl shadow-purple-200/30 transition-all duration-500 hover:shadow-3xl hover:shadow-purple-300/40 rounded-xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M16 14a4 4 0 0 0-8 0m8 0a4 4 0 0 1-8 0m8 0v1a4 4 0 0 1-8 0v-1" />
                <path d="M12 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-blue-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-slate-500 text-sm">
              Join us and start your journey today
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-slate-700 font-medium">Full Name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5">👤</div>
                <input
                  name="username"
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-12 h-12 w-full rounded border border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-300"
                />
              </div>
                {errors?.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>

            <div className="space-y-2 group">
              <label className="text-slate-700 font-medium">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5">✉️</div>
                <input
                  name="email"
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter your email"
                  className="pl-12 h-12 w-full rounded border border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-300"
                />
              </div>
                {errors?.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2 group">
              <label className="text-slate-700 font-medium">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5">🔒</div>
                <input
                  name="password"
                  onChange={handleChange}
                  type="password"
                  placeholder="Create a strong password"
                  className="pl-12 pr-12 h-12 w-full rounded border border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-300"
                />
              </div>
              {errors?.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
            >
              Create Account
            </button>
          </form>

          {/* Login link */}
          <div className="text-center mt-8 pt-6 border-t border-slate-100">
            <p className="text-slate-600">
              Already have an account?{" "}
              <a
                onClick={() => navigate('/login/')}
                className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default React.memo(Signup);