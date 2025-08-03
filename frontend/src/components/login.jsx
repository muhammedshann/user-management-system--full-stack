import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom"
import { loginUser } from "../slices/authSlice";

function Login() {
    const [userData, setUserData] = useState({ 'username': '', 'password': '' });
    const [errors, setErrors] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const errorMessage = useSelector(state => state.auth.error)
    const user = useSelector(state => state.auth.userInfo)
    if (user) return <Navigate to={'/'} replace />
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await dispatch(loginUser(userData));
            if (res.meta.requestStatus === 'fulfilled') {
                navigate('/');
                setMessage('login succesfull')
            } else {
                console.error('Login failed:', res.payload);
            }
        } catch (err) {
            if (err.message) {
                setErrors(err.message);
            } else {
                const field = Object.keys(err)[0];
                setErrors(err[field]?.[0] || 'Login failed');
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
                    {errors && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 relative">
                            <div className="flex justify-between items-center">
                                <span>{errors}</span>
                            </div>
                        </div>
                    )}
                    {/* Header */}
                    <div className="text-center mb-8 space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-4">
                            <p>🔒</p>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-blue-600 bg-clip-text text-transparent">
                            Welcome back
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6">
                        <div className="space-y-2 group">
                            <label className="text-slate-700 font-medium">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5">✉️</div>
                                <input
                                    onChange={handleChange}
                                    name="username"
                                    type="name"
                                    placeholder="Enter your email"
                                    className="pl-12 h-12 w-full rounded border border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-slate-700 font-medium">Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5">🔒</div>
                                <input
                                    onChange={handleChange}
                                    name="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    className="pl-12 pr-12 h-12 w-full rounded border border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-300"
                                />
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                        >
                            Login
                        </button>
                    </form>

                    {/* Login link */}
                    <div className="text-center mt-8 pt-6 border-t border-slate-100">
                        <p className="text-slate-600">
                            Dont have an account?{" "}
                            <a
                                onClick={() => navigate('/signup/')}
                                className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                            >
                                Signup here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default React.memo(Login);