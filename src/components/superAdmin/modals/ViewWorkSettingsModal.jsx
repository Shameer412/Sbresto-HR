import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Clock, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { fetchWorkSettings, clearWorkSettingsState } from '../../../features/employee/workSettingsSlice'; // Import from your slice

const ViewWorkSettingsModal = ({ isOpen, onClose, user, onEditRequest }) => {
  const dispatch = useDispatch();
  const { currentSettings, status } = useSelector((state) => state.workSettings);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen && user?.id) {
        dispatch(clearWorkSettingsState()); // Clear old data
        dispatch(fetchWorkSettings(user.id));
    }
  }, [isOpen, user, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Work Schedule</h3>
            <p className="text-sm text-slate-500">Settings for {user?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
            {status === 'loading' ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
            ) : currentSettings ? (
                // Data Found View
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center gap-4">
                         <div className="bg-white p-3 rounded-full shadow-sm text-indigo-600"><DollarSign size={24}/></div>
                         <div>
                             <p className="text-xs text-indigo-400 font-bold uppercase">Hourly Rate</p>
                             <p className="text-xl font-bold text-indigo-900">${currentSettings.per_hour_rate || '0.00'}</p>
                         </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-2 text-slate-500"><Clock size={16} /> <span className="text-xs font-bold uppercase">Daily Hours</span></div>
                        <p className="text-lg font-semibold text-slate-800">{currentSettings.working_hours_per_day} Hours</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-2 text-slate-500"><Calendar size={16} /> <span className="text-xs font-bold uppercase">Monthly Days</span></div>
                        <p className="text-lg font-semibold text-slate-800">{currentSettings.working_days_per_month} Days</p>
                    </div>
                </div>
            ) : (
                // No Data Found View
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Clock size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">No work settings found.</p>
                    <p className="text-sm text-slate-400">Please configure the schedule.</p>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Close</button>
          <button 
            onClick={onEditRequest} // Opens the Add/Edit Modal
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all"
          >
            {currentSettings ? 'Update Schedule' : 'Add Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewWorkSettingsModal;