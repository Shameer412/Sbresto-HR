import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, Filter, Shield, Briefcase, 
  Loader2, Phone, Calendar, Eye 
} from 'lucide-react';


import { fetchEmployees } from '../../../features/employee/employeeSlice';
import { fetchTeams } from '../../../features/team/teamSlice';
import { fetchRoles } from '../../../features/role/roleSlice';


import ViewUserModal from '../modals/ViewUserModal';

const UserManagement = () => {
  const dispatch = useDispatch();

  // --- MODAL STATES ---
 
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // --- REDUX STATE ---
  const { items: users, status, error } = useSelector((state) => state.employees);
  const { items: teams } = useSelector((state) => state.teams);
  const { items: roles } = useSelector((state) => state.roles);

  // --- FETCH DATA ---
  useEffect(() => {
    dispatch(fetchEmployees());
    if (teams.length === 0) dispatch(fetchTeams());
    if (roles.length === 0) dispatch(fetchRoles());
  }, [dispatch, teams.length, roles.length]);

  // --- HANDLERS ---
  
  // Sirf View Profile ka handler
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Helper Mappers
  const getDeptName = (id) => teams.find(t => t.id === Number(id))?.name || 'Unknown';
  const getRoleName = (id) => roles.find(r => r.id === Number(id))?.display_name || 'Employee';

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden animate-in fade-in duration-300">
      
      {/* Header (No Add Buttons) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Team Overview</h2>
          <p className="text-sm text-slate-400">View details of employees in your department.</p>
        </div>
        {/* Buttons section remove kar diya hai */}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search employee..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 shadow-sm"><Filter size={20} /></button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col relative">
        
        {status === 'loading' && (
            <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
                <span className="text-sm text-slate-500 font-medium">Loading team data...</span>
            </div>
        )}

        {status === 'failed' && (
             <div className="p-8 text-center"><div className="text-red-500 mb-1">Failed to load data</div><div className="text-xs text-slate-400">{error}</div></div>
        )}

        {!users?.length && status === 'succeeded' && (
             <div className="flex flex-col items-center justify-center flex-1 p-8 text-slate-400"><Briefcase size={48} className="mb-4 opacity-20" /><p>No employees found.</p></div>
        )}

        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 pl-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role & Dept</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-8">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-200">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-semibold text-slate-700">{user.name}</div>
                            <div className="text-xs text-slate-400 font-normal">{user.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex w-fit items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                        <Shield size={10} /> {getRoleName(user.designation_id)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium pl-1">{getDeptName(user.department_id)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1"><Phone size={12} className="text-slate-400" /> {user.phone}</div>
                        <div className="flex items-center gap-1"><Calendar size={12} className="text-slate-400" /> {user.join_date}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        {user.status}
                    </span>
                  </td>
                  
                  {/* Actions Column: Sirf View Button */}
                  <td className="p-4 text-right pr-6">
                    <button 
                        onClick={() => handleViewProfile(user)} 
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto"
                    >
                        <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS (Sirf View Modal) --- */}
      <ViewUserModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} user={selectedUser} />

    </div>
  );
};

export default UserManagement;