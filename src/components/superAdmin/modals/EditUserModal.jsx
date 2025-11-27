import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, User, Mail, Briefcase, Banknote, Save, Phone, Calendar, Loader2, Activity, BadgeCheck } from 'lucide-react';

// Actions
import { updateEmployee } from '../../../features/employee/employeeSlice';
import { fetchTeams } from '../../../features/team/teamSlice';
import { fetchRoles } from '../../../features/role/roleSlice';

const EditUserModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  
  const { items: teams } = useSelector((state) => state.teams);
  const { items: roles } = useSelector((state) => state.roles);
  const { status } = useSelector((state) => state.employees);
  
  const isSubmitting = status === 'loading';

  // Local state for form
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', department_id: '', 
    designation_id: '', join_date: '', employment_type: 'permanent', 
    basic_salary: '', status: 'active'
  });

  // Load Data on Open
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department_id: user.department_id || '',
        designation_id: user.designation_id || '',
        join_date: user.join_date || '',
        employment_type: user.employment_type || 'permanent',
        basic_salary: user.basic_salary || '',
        status: user.status || 'active'
      });
    }
    // Fetch dropdowns if missing
    if (isOpen) {
        if (teams.length === 0) dispatch(fetchTeams());
        if (roles.length === 0) dispatch(fetchRoles());
    }
  }, [isOpen, user, teams.length, roles.length, dispatch]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // 🔥 Dispatch Update Action (ID + Data)
        await dispatch(updateEmployee({ id: user.id, ...formData })).unwrap();
        onClose();
    } catch (err) {
        console.error("Update failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-5 bg-slate-50 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Edit Employee</h2>
            <button onClick={onClose}><X className="text-slate-400 hover:text-red-500 transition-colors" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-5">
            
            {/* Name */}
            <div className="relative group">
                <User className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                <input name="name" value={formData.name} required onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="Full Name" />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                    <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <input name="email" value={formData.email} type="email" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="Email" />
                </div>
                <div className="relative group">
                    <Phone className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <input name="phone" value={formData.phone} required onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="Phone" />
                </div>
            </div>

            {/* Department & Role */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Department</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                        <select name="department_id" value={formData.department_id} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 appearance-none">
                            <option value="">Select Dept</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Role</label>
                    <div className="relative">
                        <BadgeCheck className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                        <select name="designation_id" value={formData.designation_id} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 appearance-none">
                            <option value="">Select Role</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.display_name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Date & Salary */}
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Join Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                        <input name="join_date" type="date" value={formData.join_date} required onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-600" />
                    </div>
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Salary</label>
                    <div className="relative">
                        <Banknote className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                        <input name="basic_salary" type="number" value={formData.basic_salary} required onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                </div>
            </div>

            {/* Type & Status */}
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Type</label>
                    <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-amber-500">
                        <option value="permanent">Permanent</option>
                        <option value="contract">Contract</option>
                        <option value="probation">Probation</option>
                    </select>
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Status</label>
                    <div className="relative">
                        <Activity className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full pl-10 p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-amber-500">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 flex justify-center items-center gap-2 transition disabled:opacity-70">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};

export default EditUserModal;