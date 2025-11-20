import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Shield, Trash2, Edit, Briefcase } from 'lucide-react';
import { AddUserModal, ManageTeamsModal } from '../modals/UserModals'; // Modals Import kiye

const UserManagement = () => {
  // --- UI STATES ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  
  // Dummy Departments (Teams)
  const [departments, setDepartments] = useState(['IT', 'Sales', 'Marketing', 'Finance']);

  // Dummy Users Data (UI dikhane ke liye)
  const users = [
    { id: 1, name: 'Ali Khan', email: 'ali@admin.com', role: 'admin', department: 'IT', status: 'Active', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@hr.com', role: 'hr', department: 'HR', status: 'Active', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'John Doe', email: 'john@work.com', role: 'employee', department: 'Sales', status: 'Inactive', img: 'https://randomuser.me/api/portraits/men/86.jpg' },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in-up space-y-6">
      
      {/* --- 1. ACTION TOOLBAR --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Team Members</h2>
          <p className="text-sm text-slate-400">Manage roles and permissions</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Manage Teams Button */}
          <button 
            onClick={() => setIsTeamModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all"
          >
            <Briefcase size={18} /> Teams
          </button>

          {/* Add User Button */}
          <button 
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-200"
          >
            <Plus size={20} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* --- 2. FILTERS & SEARCH --- */}
      <div className="flex gap-3">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 shadow-sm">
            <Filter size={20} />
          </button>
      </div>

      {/* --- 3. USERS TABLE --- */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="p-4 pl-6 text-xs font-bold text-slate-400 uppercase tracking-wider">User Profile</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role & Team</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/80 transition-colors">
                  
                  {/* User Info */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img src={user.img} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role & Department */}
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-indigo-500" />
                        <span className="capitalize text-sm font-bold text-slate-700">{user.role}</span>
                       </div>
                       <span className="text-xs text-slate-400 ml-5">{user.department} Dept</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`
                      px-2.5 py-1 rounded-full text-xs font-bold border
                      ${user.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'}
                    `}>
                      {user.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS RENDER HERE --- */}
      <AddUserModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        departments={departments}
      />

      <ManageTeamsModal 
        isOpen={isTeamModalOpen} 
        onClose={() => setIsTeamModalOpen(false)}
        departments={departments}
        setDepartments={setDepartments}
      />

    </div>
  );
};

export default UserManagement;