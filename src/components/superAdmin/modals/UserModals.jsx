import React, { useState } from 'react';
import { X, Save, Briefcase, Shield, User } from 'lucide-react';

// --- MODAL 1: ADD USER FORM ---
export const AddUserModal = ({ isOpen, onClose, departments }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-slate-100">
        
        {/* Header */}
        <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl text-slate-800">Create New User</h3>
            <p className="text-xs text-slate-500">Assign details, roles & teams</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Form Body */}
        <form className="p-8 space-y-5">
          
          {/* Name & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
              <input type="text" placeholder="Ali Khan" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
              <input type="email" placeholder="ali@work.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          {/* Password */}
          <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Password</label>
             <input type="password" placeholder="••••••••" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          {/* 🔥 CORE LOGIC: ROLE & TEAM ASSIGNMENT */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Role Selection */}
            <div>
              <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Shield size={12} /> Assign Role
              </label>
              <select className="w-full p-3 bg-indigo-50/50 border border-indigo-100 text-indigo-900 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                <option value="admin">Super Admin</option>
                <option value="hr">HR Manager</option>
                <option value="dept_manager">Department Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            {/* Team Selection */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Briefcase size={12} /> Assign Team
              </label>
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-colors">Cancel</button>
            <button type="button" className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-400 transition-all flex items-center justify-center gap-2">
              <Save size={18} /> Create User
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// --- MODAL 2: MANAGE TEAMS FORM ---
export const ManageTeamsModal = ({ isOpen, onClose, departments, setDepartments }) => {
  const [newTeam, setNewTeam] = useState("");

  if (!isOpen) return null;

  const addTeam = () => {
    if(newTeam) {
      setDepartments([...departments, newTeam]);
      setNewTeam("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">Manage Teams</h3>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Add New Team */}
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
              placeholder="e.g. Marketing" 
              className="flex-1 p-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
            />
            <button onClick={addTeam} className="bg-indigo-600 text-white p-3 rounded-xl font-bold">+</button>
          </div>

          {/* List of Teams */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <p className="text-xs font-bold text-slate-400 uppercase">Existing Teams</p>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200">
                  {dept}
                </span>
              ))}
            </div>
          </div>
          
          <button onClick={onClose} className="w-full py-3 mt-2 bg-slate-800 text-white rounded-xl font-bold">Done</button>
        </div>
      </div>
    </div>
  );
};