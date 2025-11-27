import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, User, Mail, Briefcase, 
  Banknote, Coins, ArrowRight, ArrowLeft, 
  Phone, Calendar, Loader2, Activity, BadgeCheck
} from 'lucide-react';

// 🔥 IMPORTS: Paths check kar lijiye, ye standard structure ke hisab se hain
import { createEmployee } from '../../../features/employee/employeeSlice';
import { fetchTeams } from '../../../features/team/teamSlice';
import { fetchRoles } from '../../../features/role/roleSlice';

const AddUserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  // 🔥 REDUX STATE
  // Make sure 'roles' store.js mein register ho
  const { items: teams } = useSelector((state) => state.teams);
  const { items: roles } = useSelector((state) => state.roles); 
  const { status, error } = useSelector((state) => state.employees);
  
  const isSubmitting = status === 'loading';

  const [currentStep, setCurrentStep] = useState(1);
  
  // 🔥 FORM STATE
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    phone: '',          
    department_id: '',  
    designation_id: '', // Role ID yahan store hogi
    join_date: '',      
    employment_type: 'permanent', 
    basic_salary: '',   
    status: 'active'    
  });

  // 🔥 FETCH DATA ON MODAL OPEN
  useEffect(() => {
    if (isOpen) {
      // Agar list khali hai to fetch karo, warna purana data use karo
      if (teams.length === 0) dispatch(fetchTeams());
      if (roles.length === 0) dispatch(fetchRoles()); 
    }
  }, [isOpen, teams.length, roles.length, dispatch]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    // Validation for Step 1
    if (currentStep === 1 && (!formData.name || !formData.email || !formData.phone || !formData.department_id || !formData.designation_id)) {
      alert("Please fill in all required fields.");
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔥 SAFETY CHECK: Agar Step 2 nahi hai, to submit mat hone do
    if (currentStep !== 2) return;

    try {
        await dispatch(createEmployee(formData)).unwrap();
        
        // Reset Form & Close
        onClose();
        setCurrentStep(1);
        setFormData({
            name: '', email: '', phone: '', department_id: '', designation_id: '', join_date: '',
            employment_type: 'permanent', basic_salary: '', status: 'active'
        });
    } catch (err) {
        console.error("Failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-5 bg-slate-50 border-b flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Add New Employee</h2>
            <div className="flex gap-2 mt-1">
              <div className={`h-1.5 w-8 rounded-full transition-colors ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
              <div className={`h-1.5 w-8 rounded-full transition-colors ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
            </div>
          </div>
          <button onClick={onClose}><X className="text-slate-400 hover:text-red-500 transition-colors" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-5">
          
          {/* --- STEP 1: PERSONAL & DEPARTMENT --- */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Personal & Department</h3>
              
              {/* Name */}
              <div className="relative group">
                <User className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                <input name="name" value={formData.name} required placeholder="Full Name" onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              
              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                    <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <input name="email" value={formData.email} type="email" required placeholder="Email" onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
                <div className="relative group">
                    <Phone className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <input name="phone" value={formData.phone} required placeholder="Phone" onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
              </div>

              {/* Department Dropdown */}
              <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Department</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <select name="department_id" value={formData.department_id} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                        <option value="">Select Department</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                  </div>
              </div>

              {/* 🔥 ROLES / DESIGNATION DROPDOWN */}
              <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Designation / Role</label>
                  <div className="relative">
                    <BadgeCheck className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <select 
                      name="designation_id" 
                      value={formData.designation_id} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                    >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.display_name}
                          </option>
                        ))}
                    </select>
                  </div>
              </div>

            </div>
          )}

          {/* --- STEP 2: CONTRACT & SALARY --- */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Contract & Salary</h3>

              {/* Join Date */}
              <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Join Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <input name="join_date" type="date" value={formData.join_date} required onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-600" />
                  </div>
              </div>

              {/* Employment Type & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Type</label>
                    <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="permanent">Permanent</option>
                        <option value="contract">Contract</option>
                        <option value="probation">Probation</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Status</label>
                    <div className="relative">
                        <Activity className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full pl-10 p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
              </div>

              {/* Basic Salary */}
              <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Basic Salary</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <input name="basic_salary" type="number" value={formData.basic_salary} required placeholder="e.g. 55000" onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
              </div>

            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 flex gap-3">
            {currentStep === 1 ? (
              <>
                 {/* 🔥 type="button" zaroori hai */}
                 <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
                 
                 {/* 🔥 type="button" taaki submit na ho */}
                 <button type="button" onClick={handleNext} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 flex justify-center items-center gap-2 transition-all">
                   Next Step <ArrowRight className="w-4 h-4" />
                 </button>
              </>
            ) : (
              <>
                 <button type="button" onClick={handleBack} disabled={isSubmitting} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 flex justify-center items-center gap-2 transition">
                    <ArrowLeft className="w-4 h-4" /> Back
                 </button>
                 
                 {/* 🔥 Sirf ye button 'type=submit' hona chahiye */}
                 <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 flex justify-center items-center gap-2 transition-all disabled:opacity-70">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                    Submit Employee
                 </button>
              </>
            )}
          </div>
          
          {/* Error Feedback */}
          {error && <p className="text-center text-red-500 text-xs font-medium animate-pulse">{error}</p>}

        </form>
      </div>
    </div>
  );
};

export default AddUserModal;