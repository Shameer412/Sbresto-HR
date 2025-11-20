import React, { useState } from 'react';
import { X, User, Mail, Lock, Shield, Briefcase, CheckCircle } from 'lucide-react';

// 'teams' prop receive kiya
const AddUserModal = ({ isOpen, onClose, onSave, teams }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'employee', department: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
        
        <div className="px-8 py-5 bg-slate-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Add New User</h2>
          <button onClick={onClose}><X className="text-slate-400 hover:text-red-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {/* Inputs (Name, Email, Pass) same as before... */}
          <div className="relative group">
            <User className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            <input name="name" required placeholder="Full Name" onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            <input name="email" required placeholder="Email" onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            <input name="password" type="password" required placeholder="Password" onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Role</label>
              <select name="role" onChange={handleChange} className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="employee">Employee</option>
                <option value="hr">HR Manager</option>
                <option value="dept_manager">Dept Manager</option>
                <option value="admin">Super Admin</option>
              </select>
            </div>

            {/* 🔥 DYNAMIC TEAMS DROPDOWN */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Team</label>
              <select 
                name="department" 
                onChange={handleChange} 
                required
                className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Team</option>
                {teams.map((team, index) => (
                  <option key={index} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancel</button>
            <button type="submit" className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700">Save User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;