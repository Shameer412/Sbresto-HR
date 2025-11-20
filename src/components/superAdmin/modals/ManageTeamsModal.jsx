import React, { useState } from 'react';
import { X, Plus, Trash2, Briefcase } from 'lucide-react';

const ManageTeamsModal = ({ isOpen, onClose, teams, setTeams }) => {
  const [newTeam, setNewTeam] = useState('');

  if (!isOpen) return null;

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (newTeam.trim() !== '') {
      // Nayi team add karo
      setTeams([...teams, newTeam.trim()]);
      setNewTeam(''); // Input clear karo
    }
  };

  const handleDeleteTeam = (teamToDelete) => {
    setTeams(teams.filter(t => t !== teamToDelete));
  };

  return (
    // Z-Index 50 to ensure it's on top
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all scale-100 animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Briefcase size={18} className="text-indigo-600" /> Manage Teams
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Section */}
          <form onSubmit={handleAddTeam} className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="Enter Team Name (e.g. DevOps)"
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors">
              <Plus size={20} />
            </button>
          </form>

          {/* List of Teams */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Current Teams</h4>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {teams.length === 0 && <p className="text-sm text-slate-400 italic">No teams created yet.</p>}
              
              {teams.map((team, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 group">
                  {team}
                  <button 
                    onClick={() => handleDeleteTeam(team)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={onClose} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageTeamsModal;