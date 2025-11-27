import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, Briefcase, Trash2, Edit2, Save, AlertCircle, Loader2 } from 'lucide-react';
import { 
  addTeam, 
  updateTeam, 
  deleteTeam, 
  fetchTeams 
} from '../../../features/team/teamSlice'; 

const ManageTeamsModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  // Redux State
  const { items: teams, status, error } = useSelector((state) => state.teams);

  // Local State
  const [inputName, setInputName] = useState('');
  const [editingId, setEditingId] = useState(null); 
  const [validationError, setValidationError] = useState('');
  
  // Specific loading states for better UX
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen && status === 'idle') {
      dispatch(fetchTeams());
    }
  }, [isOpen, status, dispatch]);

  if (!isOpen) return null;

  // --- HANDLERS ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = inputName.trim();

    if (!trimmedName) return;

    // 1. Duplicate Check (Case Insensitive)
    const isDuplicate = teams?.some(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase() && t.id !== editingId
    );

    if (isDuplicate) {
      setValidationError('Team with this name already exists.');
      return;
    }

    setIsSubmitting(true);
    setValidationError('');

    try {
      if (editingId) {
        // 🔥 UPDATE API CALL
        await dispatch(updateTeam({ id: editingId, name: trimmedName })).unwrap();
        setEditingId(null);
      } else {
        // 🔥 ADD API CALL
        await dispatch(addTeam(trimmedName)).unwrap();
      }
      setInputName('');
    } catch (err) {
      setValidationError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      setDeletingId(id);
      try {
        // 🔥 DELETE API CALL
        await dispatch(deleteTeam(id)).unwrap();
      } catch (err) {
        alert("Could not delete team.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEditClick = (team) => {
    setInputName(team.name);
    setEditingId(team.id);
    setValidationError('');
    // Input field ko focus karne ke liye chota sa hack (Optional)
    document.getElementById('teamInput')?.focus();
  };

  const handleCancelEdit = () => {
    setInputName('');
    setEditingId(null);
    setValidationError('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* --- HEADER --- */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Briefcase size={20} className="text-indigo-600" /> 
              Manage Teams
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Add or edit company departments</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- BODY --- */}
        <div className="p-6 overflow-hidden flex flex-col gap-6">
          
          {/* 1. INPUT FORM */}
          <div className="flex flex-col gap-2">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  id="teamInput"
                  type="text" 
                  className={`w-full pl-4 pr-4 py-3 border rounded-xl outline-none text-sm font-medium transition-all ${
                    validationError 
                      ? 'border-red-300 focus:ring-4 focus:ring-red-100 bg-red-50/30' 
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                  placeholder={editingId ? "Update team name..." : "e.g. Human Resources"}
                  value={inputName}
                  onChange={(e) => {
                    setInputName(e.target.value);
                    if(validationError) setValidationError('');
                  }}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={!inputName.trim() || isSubmitting}
                className={`flex items-center justify-center w-12 rounded-xl transition-all shadow-md active:scale-95 ${
                  editingId 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : editingId ? (
                  <Save size={20} />
                ) : (
                  <Plus size={22} />
                )}
              </button>

              {editingId && (
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center w-12 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
                  title="Cancel Edit"
                >
                  <X size={20} />
                </button>
              )}
            </form>

            {/* Error Message */}
            {(validationError || error) && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium px-1 animate-in slide-in-from-top-1">
                <AlertCircle size={12} />
                {validationError || error}
              </div>
            )}
          </div>

          {/* 2. TEAMS LIST */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Existing Teams
              </h4>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                {teams?.length || 0}
              </span>
            </div>
            
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-2">
              {/* LOADING STATE */}
              {status === 'loading' && teams.length === 0 && (
                 <div className="text-center py-8 text-slate-400 flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-indigo-500" size={24} />
                    <span className="text-xs">Loading teams...</span>
                 </div>
              )}

              {/* EMPTY STATE */}
              {status !== 'loading' && (!teams || teams.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                  <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Briefcase size={20} className="text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">No teams found</p>
                  <p className="text-xs text-slate-400">Add a new one above</p>
                </div>
              )}
              
              {/* LIST ITEMS */}
              {teams?.map((team) => (
                <div 
                  key={team.id}
                  className={`group flex items-center justify-between px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 ${
                    editingId === team.id 
                      ? 'border-amber-400 bg-amber-50 shadow-sm ring-1 ring-amber-100' 
                      : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm hover:translate-x-1'
                  }`}
                >
                  <span className={`truncate flex-1 ${editingId === team.id ? 'text-amber-900' : 'text-slate-700'}`}>
                    {team.name}
                  </span>
                  
                  <div className={`flex items-center gap-1 transition-opacity ${editingId === team.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button 
                      onClick={() => handleEditClick(team)}
                      disabled={deletingId === team.id}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg transition-colors disabled:opacity-30"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(team.id)}
                      disabled={deletingId === team.id}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === team.id ? (
                        <Loader2 size={15} className="animate-spin text-red-500" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button 
                onClick={onClose} 
                className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800 text-slate-700 rounded-xl font-semibold transition-all shadow-sm"
            >
                Done
            </button>
        </div>

      </div>
    </div>
  );
};

export default ManageTeamsModal;