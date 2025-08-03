import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import React from "react";

function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {userInfo} = useSelector(state => state.auth)
    const setLogout = () => {
        dispatch(logout())
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center p-4 relative">
            {/* Floating visuals */}
            <div className="absolute top-32 right-32 w-32 h-32 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute bottom-32 left-32 w-36 h-36 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-30 animate-bounce"></div>

            {/* Main content */}
            <div className="text-center space-y-8 z-10">
                <div className="space-y-4">
                    {userInfo && (
                        <>
                            <div className="text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                                        <img src={userInfo?.profile || 'https://www.w3schools.com/howto/img_avatar.png'} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent">
                        {`Welcome ${userInfo ? userInfo.username : ''} to Our Platform`}
                    </h1>
                    <p className="text-slate-600 text-lg max-w-md mx-auto">
                        Experience seamless authentication with our modern and secure login system.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {userInfo ? (
                        <>
                            <button
                                onClick={setLogout}
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                logout
                            </button>
                            <button
                                onClick={() => navigate('/profile/')}
                                className="w-full sm:w-auto border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 bg-transparent"
                            >
                                Profile
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login/')}
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/signup/')}
                                className="w-full sm:w-auto border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 bg-transparent"
                            >
                                Create Account
                            </button>
                        </>
                    )}
                    {userInfo?.is_superuser && (
                        <button
                                onClick={() => navigate('/admin_users/')}
                                className="w-full sm:w-auto border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 bg-transparent"
                            >
                                View users
                        </button>
                    )}
                </div>
            </div>
        </div>

    );
}
export default React.memo(Home)
