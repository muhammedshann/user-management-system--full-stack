import React,{ useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../slices/authSlice";
import { validate } from "../utils/validation";

function Profile() {
    const [showModal, setModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [profile,setProfile] = useState(null);
    const dispatch = useDispatch();
    const {userInfo, loading, error} = useSelector(state => state.auth)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validated = validate({username:formData.username,email:formData.email},{usernameRequired: true,emailRequired: true,passwordRequired: false})
        if (Object.keys(validated).length > 0) {
            setErrors(validated)
            return;
        }
        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        if (profile) data.append('profile', profile);

        try {
            await dispatch(updateUser(data)).unwrap();
            setModal(false);
        } catch (err) {
            if (err.message) {
                setErrors({ errorMessage: err.message });
            } else {
                const field = Object.keys(err)[0];
                setErrors({ errorMessage: err[field]?.[0] || 'update user failed' });
            }
        }
    };

    return (
        <>
            <div className="min-h-screen bg-white">
                <div className="max-w-2xl mx-auto px-6 py-16">
                    <div className="absolute top-32 right-32 w-32 h-32 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-32 left-32 w-36 h-36 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-30 animate-bounce"></div>
                    {/* Profile Header */}
                    <div className="text-center mb-16">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                                <img src={userInfo?.profile || 'https://www.w3schools.com/howto/img_avatar.png'} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-light text-gray-900 mb-2">{userInfo.username}</h1>
                        <p className="text-gray-500">{userInfo.email}</p>
                    </div>

                    {/* Profile Info Cards */}
                    <div className="space-y-8">

                        {/* Personal Info */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Personal</h2>
                                <button className="text-gray-500 hover:text-gray-900" onClick={() => { setFormData(userInfo),setModal(true)}}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M11 5H6a2 2 0 00-2 2v11.586A2 2 0 005.586 21H17a2 2 0 002-2v-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18.5 2.5l3 3L13 14H10v-3L18.5 2.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M5.121 17.804A13.937 13.937 0 0112 15c2.564 0 4.946.755 6.879 2.049M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="text-gray-900 font-medium">{userInfo.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M16 12H8m8 0a4 4 0 100-8 4 4 0 000 8zm-8 0a4 4 0 100-8 4 4 0 000 8zM4 16h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">email</p>
                                        <p className="text-gray-900 font-medium">{userInfo.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                        >
                            &times;
                        </button>
                        {errors.errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 relative">
                                <div className="flex justify-between items-center">
                                    <span>{errors.errorMessage}</span>
                                </div>
                            </div>
                        )}

                        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Edit Profile</h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    placeholder={userInfo.username}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    placeholder={userInfo.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Profile Picture</label>
                                <input
                                    type="file"
                                    name="profilePic"
                                    accept="image/*"
                                    onChange={(e) => setProfile(e.target.files[0])}
                                    className="w-full text-sm"
                                />
                                {profile && (
                                    <img
                                        src={URL.createObjectURL(profile)}
                                        alt="Preview"
                                        className="mt-3 w-20 h-20 rounded-full object-cover border"
                                    />
                                )}
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition duration-150"
                            >
                                {loading ? 'loading ...' : 'Save changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </>
    )
}
export default React.memo(Profile);