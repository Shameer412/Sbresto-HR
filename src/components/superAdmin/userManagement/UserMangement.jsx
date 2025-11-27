import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, Plus, Filter, Shield, Trash2, Briefcase, 
  Loader2, Phone, Calendar, Edit, Eye, Key // 🔥 Key Icon Import
} from 'lucide-react';

// Actions
import { fetchEmployees, deleteEmployee } from '../../../features/employee/employeeSlice';
import { fetchTeams } from '../../../features/team/teamSlice';
import { fetchRoles } from '../../../features/role/roleSlice';

// Modals
import AddUserModal from '../modals/AddUserModal';
import ManageTeamsModal from '../modals/ManageTeamsModal';
import EditUserModal from '../modals/EditUserModal';
import ViewUserModal from '../modals/ViewUserModal';
import CreateUserModal from '../modals/CreateUserModal'; // 🔥 Import New Modal

const UserManagement = () => {
  const dispatch = useDispatch();

  // --- MODAL STATES ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false); // 🔥 New State
  
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      dispatch(deleteEmployee(id));
    }
  };

  const handleEdit = (user) => { setSelectedUser(user); setIsEditModalOpen(true); };
  const handleViewProfile = (user) => { setSelectedUser(user); setIsViewModalOpen(true); };
  
  // 🔥 Handle Create User Login
  const handleCreateLogin = (user) => {
    setSelectedUser(user);
    setIsCreateUserModalOpen(true);
  };

  const getDeptName = (id) => teams.find(t => t.id === Number(id))?.name || 'Unknown';
  const getRoleName = (id) => roles.find(r => r.id === Number(id))?.display_name || 'Employee';

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-400">Manage your employees, track roles and departments.</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => setIsTeamModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all shadow-sm">
            <Briefcase size={18} /> Manage Teams
          </button>
          <button onClick={() => setIsUserModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-200 transition-all">
            <Plus size={20} /> Add Employee
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 shadow-sm"><Filter size={20} /></button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col relative">
        {status === 'loading' && (
            <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
                <span className="text-sm text-slate-500 font-medium">Loading employees...</span>
            </div>
        )}

        {status === 'failed' && <div className="p-8 text-center text-red-500">Failed to load data: {error}</div>}

        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 pl-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role & Dept</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Details</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-8">Actions</th>
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
                  <td className="p-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1"><Phone size={12} /> {user.phone}</div>
                        <div className="flex items-center gap-1"><Calendar size={12} /> {user.join_date}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {user.status}
                    </span>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                        {/* 🔥 Create Login Button */}
                        <button onClick={() => handleCreateLogin(user)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Create Login">
                            <Key size={18} />
                        </button>

                        <button onClick={() => handleViewProfile(user)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View"><Eye size={18} /></button>
                        <button onClick={() => handleEdit(user)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}
      <AddUserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
      <ManageTeamsModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} />
      
      {/* Edit & View */}
      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} />
      <ViewUserModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} user={selectedUser} />
      
      {/* 🔥 Create Login Modal */}
      <CreateUserModal isOpen={isCreateUserModalOpen} onClose={() => setIsCreateUserModalOpen(false)} user={selectedUser} />

    </div>
  );
};

export default UserManagement;