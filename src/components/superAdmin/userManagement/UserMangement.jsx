import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, Plus, Filter, Shield, Trash2, Briefcase, 
  Loader2, Edit, Eye, Key, Clock, Grid, List,
  Users, UserPlus, CheckCircle, XCircle, Building,
  MoreVertical, ChevronDown
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
import CreateUserModal from '../modals/CreateUserModal'; 
import ViewWorkSettingsModal from '../modals/ViewWorkSettingsModal';
import AddWorkSettingsModal from '../modals/AddWorkSettingsModal';

const UserManagement = () => {
  const dispatch = useDispatch();

  // States
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isViewSettingsOpen, setIsViewSettingsOpen] = useState(false);
  const [isAddSettingsOpen, setIsAddSettingsOpen] = useState(false);

  // Redux State
  const { items: users, status, error } = useSelector((state) => state.employees);
  const { items: teams } = useSelector((state) => state.teams);
  const { items: roles } = useSelector((state) => state.roles);

  useEffect(() => {
    dispatch(fetchEmployees());
    if (teams.length === 0) dispatch(fetchTeams());
    if (roles.length === 0) dispatch(fetchRoles());
  }, [dispatch, teams.length, roles.length]);

  // Handlers
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      dispatch(deleteEmployee(id));
    }
  };

  const handleAction = (type, user) => {
    setSelectedUser(user);
    switch(type) {
      case 'edit': setIsEditModalOpen(true); break;
      case 'view': setIsViewModalOpen(true); break;
      case 'login': setIsCreateUserModalOpen(true); break;
      case 'settings': setIsViewSettingsOpen(true); break;
      default: break;
    }
  };

  const openAddSettingsModal = () => {
    setIsViewSettingsOpen(false);
    setIsAddSettingsOpen(true);
  };

  // Helpers
  const getDeptName = (id) => teams.find(t => t.id === Number(id))?.name || 'Unknown';
  const getRoleName = (id) => roles.find(r => r.id === Number(id))?.display_name || 'Employee';

  // Filter Logic
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = 
        selectedFilter === 'all' || 
        user.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, selectedFilter]);

  // Stats
  const stats = {
    total: users?.length || 0,
    active: users?.filter(u => u.status === 'active').length || 0,
    inactive: users?.filter(u => u.status === 'inactive').length || 0
  };

  return (
    <div className="h-full flex flex-col bg-white p-6 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">{stats.total} employees • {stats.active} active</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsTeamModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Building size={16} /> Teams
          </button>
          <button 
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
          >
            <Plus size={18} /> Add Member
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="text-blue-500" size={20} />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <CheckCircle className="text-green-500" size={20} />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
            <XCircle className="text-gray-500" size={20} />
          </div>
        </div>
      </div>

     

      {/* Content Area */}
      <div className="relative min-h-[400px]">
        
        {/* Loading */}
        {status === 'loading' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 rounded-lg">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
            <span className="text-sm text-gray-500 font-medium">Loading employees...</span>
          </div>
        )}

        {/* Error */}
        {status === 'failed' && (
          <div className="flex flex-col items-center justify-center py-20 text-red-600">
            <p>Failed to load employees</p>
            <span className="text-sm mt-1">{error}</span>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredUsers?.map((user) => (
              <div key={user.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.status}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase size={14} />
                    <span>{getDeptName(user.department_id)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield size={14} />
                    <span>{getRoleName(user.designation_id)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    <ActionButton 
                      icon={Key}
                      onClick={() => handleAction('login', user)}
                      color="text-green-600"
                      tooltip="Create Login"
                    />
                    <ActionButton 
                      icon={Clock}
                      onClick={() => handleAction('settings', user)}
                      color="text-blue-600"
                      tooltip="Work Settings"
                    />
                  </div>
                  <div className="flex gap-2">
                    <ActionButton 
                      icon={Eye}
                      onClick={() => handleAction('view', user)}
                      color="text-gray-600"
                      tooltip="View Details"
                    />
                    <ActionButton 
                      icon={Edit}
                      onClick={() => handleAction('edit', user)}
                      color="text-amber-600"
                      tooltip="Edit"
                    />
                    <ActionButton 
                      icon={Trash2}
                      onClick={() => handleDelete(user.id)}
                      color="text-red-600"
                      tooltip="Delete"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-700">{getDeptName(user.department_id)}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-700">{getRoleName(user.designation_id)}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <ActionButton 
                          icon={Key}
                          onClick={() => handleAction('login', user)}
                          color="text-green-600"
                          tooltip="Create Login"
                        />
                        <ActionButton 
                          icon={Clock}
                          onClick={() => handleAction('settings', user)}
                          color="text-blue-600"
                          tooltip="Work Settings"
                        />
                        <ActionButton 
                          icon={Eye}
                          onClick={() => handleAction('view', user)}
                          color="text-gray-600"
                          tooltip="View Details"
                        />
                        <ActionButton 
                          icon={Edit}
                          onClick={() => handleAction('edit', user)}
                          color="text-amber-600"
                          tooltip="Edit"
                        />
                        <ActionButton 
                          icon={Trash2}
                          onClick={() => handleDelete(user.id)}
                          color="text-red-600"
                          tooltip="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!status.includes('loading') && filteredUsers?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={48} className="mb-4 opacity-20" />
            <p>No employees found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      <AddUserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
      <ManageTeamsModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} />
      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} />
      <ViewUserModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} user={selectedUser} />
      <CreateUserModal isOpen={isCreateUserModalOpen} onClose={() => setIsCreateUserModalOpen(false)} user={selectedUser} />
      
      <ViewWorkSettingsModal 
        isOpen={isViewSettingsOpen} 
        onClose={() => setIsViewSettingsOpen(false)} 
        user={selectedUser}
        onEditRequest={openAddSettingsModal}
      />
      <AddWorkSettingsModal 
        isOpen={isAddSettingsOpen} 
        onClose={() => setIsAddSettingsOpen(false)} 
        user={selectedUser} 
      />

    </div>
  );
};

// Reusable Components
const ActionButton = ({ icon: Icon, onClick, color, tooltip }) => (
  <button 
    onClick={onClick} 
    title={tooltip}
    className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${color}`}
  >
    <Icon size={18} />
  </button>
);

const StatCard = ({ title, value, icon: Icon, color, textColor }) => (
  <div className={`${color} p-4 rounded-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
      <Icon className={textColor} size={20} />
    </div>
  </div>
);

export default UserManagement;