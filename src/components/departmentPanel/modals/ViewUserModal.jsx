import React from 'react';
import { useSelector } from 'react-redux';
import { X, Mail, Phone, Briefcase, Calendar, Shield, Activity } from 'lucide-react';

const ViewUserModal = ({ isOpen, onClose, user }) => {
  // Redux se data le rahe hain names show karne ke liye
  const { items: teams } = useSelector((state) => state.teams);
  const { items: roles } = useSelector((state) => state.roles);

  if (!isOpen || !user) return null;

  // Helpers to convert ID to Name
  const getDeptName = (id) => teams.find(t => t.id === Number(id))?.name || 'N/A';
  const getRoleName = (id) => roles.find(r => r.id === Number(id))?.display_name || 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header with Avatar */}
        <div className="bg-slate-50 border-b px-6 py-6 flex justify-between items-start">
            <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl shadow-sm border border-indigo-200">
                    {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">{user.name}</h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-500 uppercase mt-1 shadow-sm">
                        <Shield size={10} /> {getRoleName(user.designation_id)}
                    </span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all">
                <X size={18} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* Contact Info */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Contact Details</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Mail size={16} className="text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Phone size={16} className="text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium">{user.phone}</span>
                    </div>
                </div>
            </div>

            {/* Job Details (No Salary) */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Work Information</h3>
                <div className="grid grid-cols-2 gap-3">
                    
                    {/* Department */}
                    <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Department</span>
                        <div className="flex items-center gap-2 font-medium text-slate-700 mt-1">
                            <Briefcase size={14} className="text-slate-400" />
                            <span className="text-sm truncate">{getDeptName(user.department_id)}</span>
                        </div>
                    </div>

                    {/* Join Date */}
                    <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Joined On</span>
                        <div className="flex items-center gap-2 font-medium text-slate-700 mt-1">
                            <Calendar size={14} className="text-slate-400" />
                            <span className="text-sm">{user.join_date}</span>
                        </div>
                    </div>

                    {/* Type */}
                    <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 col-span-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Employment Type</span>
                        <div className="flex items-center gap-2 font-medium text-slate-700 mt-1 capitalize">
                            <Activity size={14} className="text-slate-400" />
                            <span className="text-sm">{user.employment_type}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            <div className="pt-2">
                 <div className={`w-full text-center py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider ${
                    user.status === 'active' 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                 }`}>
                    Current Status: {user.status}
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;