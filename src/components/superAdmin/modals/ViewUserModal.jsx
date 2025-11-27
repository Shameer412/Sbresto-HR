import React from 'react';
import { useSelector } from 'react-redux';
import { X, User, Mail, Phone, Briefcase, Calendar, Shield, Activity, Banknote } from 'lucide-react';

const ViewUserModal = ({ isOpen, onClose, user }) => {
  // 🔥 REDUX: IDs ko Naam mein badalne ke liye
  const { items: teams } = useSelector((state) => state.teams);
  const { items: roles } = useSelector((state) => state.roles);

  if (!isOpen || !user) return null;

  // Helpers
  const getDeptName = (id) => teams.find(t => t.id === Number(id))?.name || 'N/A';
  const getRoleName = (id) => roles.find(r => r.id === Number(id))?.display_name || 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header with Avatar */}
        <div className="bg-slate-50 border-b px-8 py-6 flex justify-between items-start">
            <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl shadow-inner">
                    {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 uppercase mt-1">
                        <Shield size={10} /> {getRoleName(user.designation_id)}
                    </span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition-all">
                <X size={20} />
            </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* Contact Info */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 border-b pb-1">Contact Information</h3>
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Mail size={18} className="text-indigo-400" />
                        <span className="text-sm font-medium">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Phone size={18} className="text-indigo-400" />
                        <span className="text-sm font-medium">{user.phone}</span>
                    </div>
                </div>
            </div>

            {/* Job Details */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 border-b pb-1">Job Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-xs text-slate-500">Department</span>
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                            <Briefcase size={16} className="text-slate-400" />
                            {getDeptName(user.department_id)}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-slate-500">Joining Date</span>
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                            <Calendar size={16} className="text-slate-400" />
                            {user.join_date}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-slate-500">Employment Type</span>
                        <div className="flex items-center gap-2 font-medium text-slate-700 capitalize">
                            <Activity size={16} className="text-slate-400" />
                            {user.employment_type}
                        </div>
                    </div>
                     <div className="space-y-1">
                        <span className="text-xs text-slate-500">Salary</span>
                        <div className="flex items-center gap-2 font-medium text-emerald-600">
                            <Banknote size={16} className="text-emerald-500" />
                            {user.basic_salary?.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            <div className="pt-2">
                 <div className={`w-full text-center py-2 rounded-xl text-sm font-bold uppercase tracking-wide ${
                    user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                 }`}>
                    Status: {user.status}
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;