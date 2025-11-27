import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Mail, Lock, Key, Shield, Loader2, Save } from 'lucide-react';

// Actions
import { createEmployeeUser, clearMessages } from '../../../features/employee/employeeSlice';
import { fetchRoles } from '../../../features/role/roleSlice';

const CreateUserModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  
  // Redux Data
  const { items: roles } = useSelector((state) => state.roles);
  const { status, error, successMessage } = useSelector((state) => state.employees);
  const isSubmitting = status === 'loading';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    // 🔥 FIX: API requires 'role' key, not 'role_id'
    role: '' 
  });

  // Init Data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      if (roles.length === 0) dispatch(fetchRoles()); // Ensure roles are loaded
      dispatch(clearMessages()); // Clear old errors
      
      setFormData({
        email: user.email || '', // Pre-fill email
        password: '',
        password_confirmation: '',
        // 🔥 FIX: Assign designation_id to 'role'
        role: user.designation_id || '' 
      });
    }
  }, [isOpen, user, roles.length, dispatch]);

  // Close on Success
  useEffect(() => {
    if (successMessage && isOpen) {
        alert(successMessage);
        onClose();
        dispatch(clearMessages()); // Clear success message so it doesn't alert again
    }
  }, [successMessage, isOpen, onClose, dispatch]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
        alert("Passwords do not match!");
        return;
    }
    
    // Dispatch Action
    // Payload ab hoga: { id: 123, email: '...', password: '...', role: 7 }
    dispatch(createEmployeeUser({ id: user.id, ...formData }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
            <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Key size={18} className="text-indigo-600" />
                    Create Login Credentials
                </h2>
                <p className="text-xs text-slate-500">For Employee: {user.name}</p>
            </div>
            <button onClick={onClose}><X className="text-slate-400 hover:text-red-500 transition-colors" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Email */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Login Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 p-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 p-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="******" />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Confirm</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input name="password_confirmation" type="password" required value={formData.password_confirmation} onChange={handleChange} className="w-full pl-10 p-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="******" />
                    </div>
                </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Assign User Role</label>
                <div className="relative">
                    <Shield className="absolute left-3 top-3 text-slate-400" size={16} />
                    {/* 🔥 FIX: name="role" kar diya hai taaki API validation pass ho */}
                    <select name="role" required value={formData.role} onChange={handleChange} className="w-full pl-10 p-2.5 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            // Value ID hi jayegi (e.g., 7)
                            <option key={role.id} value={role.id}>{role.display_name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 flex justify-center items-center gap-2 transition disabled:opacity-70">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Create Login
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-center text-red-500 text-xs font-medium bg-red-50 p-2 rounded-lg">
                    {/* Agar error object ho (validation errors) to string mein convert karo */}
                    {typeof error === 'object' ? Object.values(error).flat().join(', ') : error}
                </div>
            )}

        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;