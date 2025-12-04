import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Save, Loader2 } from 'lucide-react';
import { saveWorkSettings, clearSettingsMessages } from '../../../features/employee/workSettingsSlice';

const AddWorkSettingsModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const { status, successMessage, error } = useSelector((state) => state.workSettings);

  const [formData, setFormData] = useState({
    working_hours_per_day: '',
    working_days_per_month: ''
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    const payload = {
        employee_id: user.id,
        working_hours_per_day: Number(formData.working_hours_per_day),
        working_days_per_month: Number(formData.working_days_per_month)
    };

    dispatch(saveWorkSettings(payload));
  };

  // Close modal on success
  useEffect(() => {
    if (successMessage) {
        setTimeout(() => {
            dispatch(clearSettingsMessages());
            onClose(); // Close modal automatically
        }, 1500);
    }
  }, [successMessage, onClose, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Configure Schedule</h3>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Alerts */}
            {successMessage && <div className="p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg border border-emerald-100">{successMessage}</div>}
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{typeof error === 'string' ? error : 'Error saving data'}</div>}

            {/* Inputs */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Working Hours (Per Day)</label>
                <input 
                    type="number" 
                    name="working_hours_per_day"
                    value={formData.working_hours_per_day}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. 8"
                    required
                    min="1"
                    max="24"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Working Days (Per Month)</label>
                <input 
                    type="number" 
                    name="working_days_per_month"
                    value={formData.working_days_per_month}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. 26"
                    required
                    min="1"
                    max="31"
                />
            </div>

            <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-70"
                >
                    {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Settings
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkSettingsModal;