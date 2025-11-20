import React, { useState } from 'react';
import { Search, Plus, Filter, Shield, Trash2, Edit, Briefcase } from 'lucide-react';
import AddUserModal from '../modals/AddUserModal';
import ManageTeamsModal from '../modals/ManageTeamsModal';

const UserManagement = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  
  // 🔥 DYNAMIC STATE FOR TEAMS (Default values)
  const [teams, setTeams] = useState(['IT', 'Sales', 'Marketing']);
  
  // Dummy Users
  const [users, setUsers] = useState([
    { id: 1, name: 'Ali Khan', email: 'ali@co.com', role: 'admin', department: 'IT', status: 'Active' },
  ]);

  const handleSaveUser = (newUser) => {
    setUsers([...users, { id: users.length + 1, ...newUser, status: 'Active' }]);
  };

  return (
    // 🔥 FIX: 'h-full' ensure karega height viewport jitni ho, 'overflow-hidden' page scroll rokega
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-400">Manage your team members and their roles.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsTeamModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all shadow-sm"
          >
            <Briefcase size={18} /> Manage Teams
          </button>
          <button 
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-200 transition-all"
          >
            <Plus size={20} /> Add User
          </button>
        </div>
      </div>

      {/* --- SEARCH & FILTER (Fixed Height) --- */}
      <div className="flex gap-3 flex-shrink-0">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 shadow-sm"><Filter size={20} /></button>
      </div>

      {/* --- TABLE CONTAINER (Scrollable Area) --- */}
      {/* 🔥 FIX: 'flex-1' lega bachi hui height, 'overflow-hidden' parent pe */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col">
        
        {/* 🔥 FIX: 'overflow-auto' sirf table ko scroll karega */}
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            {/* 🔥 FIX: 'sticky top-0' header ko chipka dega */}
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 pl-6 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role & Team</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-700">{user.name} <br/><span className="text-xs text-slate-400 font-normal">{user.email}</span></td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-xs uppercase text-slate-700 flex items-center gap-1"><Shield size={10}/> {user.role}</span>
                      <span className="text-xs text-slate-500">{user.department}</span>
                    </div>
                  </td>
                  <td className="p-4"><span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-xs font-bold">{user.status}</span></td>
                  <td className="p-4 text-right pr-6">
                    <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}
      {/* Teams prop pass kiya */}
      <AddUserModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        onSave={handleSaveUser}
        teams={teams} 
      />

      {/* setTeams prop pass kiya taaki update kar sakein */}
      <ManageTeamsModal 
        isOpen={isTeamModalOpen} 
        onClose={() => setIsTeamModalOpen(false)}
        teams={teams}
        setTeams={setTeams}
      />

    </div>
  );
};

export default UserManagement;