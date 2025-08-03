import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, deleteUser, adminUpdateUser } from '../slices/adminSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { validate } from '../utils/validation';
import debounce from "lodash.debounce";


const AdminUsers = () => {
    const [showEditModal, setEditModal] = useState(false);
    const [message,setMessage] = useState('')
    const [errors,setErrors] = useState({});
    const [showAddModal, setAddModal] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [query, setQuery] = useState("");
    const [formData, setFormData] = useState({ username: '', email: '', password: '', is_active: true, is_superuser: false, is_staff: false });
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { users, error } = useSelector(state => state.admin)

    const debouncedSearch = useMemo(() => {
        return debounce((searchTerm) => {
        dispatch(fetchUsers(searchTerm));
        }, 300);
    }, [dispatch]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        dispatch(fetchUsers(''));
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const validated = validate({username:formData.username,email:formData.email},{usernameRequired: false,emailRequired: false,passwordRequired: false,})
        if (Object.keys(validated).length > 0){
            setErrors(validated)
            return;
        }
        try {
            await dispatch(adminUpdateUser({id :editUserId.id ,formData})).unwrap();
            setEditModal(false);
            setMessage('user edited succesfully')
        } catch (err) {
            if (err.message) {
                setErrors({ errorMessage: err.message });
            } else {
                const field = Object.keys(err)[0];
                setErrors({ errorMessage: err[field]?.[0] || 'Update failed' });
            }
            setMessage('');
        }
    };
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const validated = validate({username:formData.username,email:formData.email,password:formData.password},{usernameRequired: true,emailRequired: true,passwordRequired: true,})
        if (Object.keys(validated).length > 0){
            setErrors(validated)
            return;
        }
        try {
            await dispatch(addUser(formData)).unwrap();
            setAddModal(false);
            setMessage('user added succesfully')
        } catch (err) {
            if (err.message) {
                setErrors({ errorMessage: err.message });
            } else {
                const field = Object.keys(err)[0];
                setErrors({ errorMessage: err[field]?.[0] || 'Add user failed' });
            }
            setMessage('');
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await dispatch(deleteUser(id))
            if (deleteUser.fulfilled.match(result)){
                dispatch(fetchUsers());
                setMessage('user deleted succesfully')
            }else{
                const errorMsg = result.payload?.detail || result.payload?.error || 'Something went wrong';
                setMessage(errorMsg);
            }
        } catch (error) {
            console.log(error)
            setMessage(error.message)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-6 flex items-center justify-center relative">
            {/* Floating Visuals */}
            <div className="absolute top-32 right-32 w-32 h-32 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute bottom-32 left-32 w-36 h-36 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-30 animate-bounce"></div>

            {/* Centered Content */}
            <div className="relative z-10 w-full max-w-6xl">
                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 relative">
                        <div className="flex justify-between items-center">
                            <span>{message}</span>
                            <button onClick={() => setMessage('')} className="font-bold text-xl leading-none ml-4">
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-light text-gray-800">Users</h1>
                    <div className="flex gap-4">
                        <div>
                            <input
                                type="text"
                                value={query}
                                onChange={handleSearchChange}
                                placeholder="Search user..."
                                className="border border-gray-300 px-3 py-2 rounded w-full"
                            />
                        </div>
                        <button
                            onClick={() => {setFormData(''),setAddModal(true),setErrors({})}}
                            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition">Add
                        </button>
                        <button
                            onClick={() => {
                                dispatch(logout())
                                window.location.href = '/login';
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition">Logout
                        </button>
                    </div>
                </div>


                {/* Table */}
                <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow border border-white/40 overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-white/30">
                            <tr className="text-sm text-gray-500 border-b border-gray-100">
                                <th className="text-left px-5 py-3">ID</th>
                                <th className="text-left px-5 py-3">Username</th>
                                <th className="text-left px-5 py-3">Email</th>
                                <th className="text-left px-5 py-3">Active</th>
                                <th className="text-left px-5 py-3">Superuser</th>
                                <th className="text-left px-5 py-3">staff</th>
                                <th className="text-right px-5 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user) => (
                                <tr key={user.id} className="text-sm hover:bg-white/50 transition border-b border-gray-100">
                                    <td className="px-5 py-3 font-mono text-gray-500">{user.id}</td>
                                    <td className="px-5 py-3 font-medium text-gray-800">{user.username}</td>
                                    <td className="px-5 py-3 text-gray-600">{user.email}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-block w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-block w-2 h-2 rounded-full ${user.is_superuser ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-block w-2 h-2 rounded-full ${user.is_staff ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditModal(true);
                                                    setFormData(user);
                                                    setEditUserId(user);
                                                    setErrors({})
                                                }}
                                                className="text-gray-500 hover:text-gray-700 text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-500 hover:text-red-700 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => {setFormData(''),setEditModal(false)}}
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg"
                        >
                            ×
                        </button>
                        {errors.errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 relative">
                                <div className="flex justify-between items-center">
                                    <span>{errors.errorMessage}</span>
                                </div>
                            </div>
                        )}
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Edit Profile</h2>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="is_staff"
                                    checked={formData.is_staff}
                                    onChange={handleChange}
                                />
                                <label className="text-sm text-gray-600">Staff</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="is_superuser"
                                    checked={formData.is_superuser}
                                    onChange={handleChange}
                                />
                                <label className="text-sm text-gray-600">Superuser</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                />
                                <label className="text-sm text-gray-600">Active</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setAddModal(false)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg"
                        >
                            ×
                        </button>
                        
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Add User</h2>
                        {errors.errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 relative">
                                <div className="flex justify-between items-center">
                                    <span>{errors.errorMessage}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="is_staff"
                                    checked={formData.is_staff}
                                    onChange={handleChange}
                                />
                                <label className="text-sm text-gray-600">Staff</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="is_superuser"
                                    checked={formData.is_superuser}
                                    onChange={handleChange}
                                />
                                <label className="text-sm text-gray-600">Superuser</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Add User
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );
};

export default React.memo(AdminUsers);