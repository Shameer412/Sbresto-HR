import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, Calendar, User, ChevronRight, Download, 
  Loader2, Briefcase, Clock, MapPin 
} from 'lucide-react';

// Real Redux Actions
import { fetchEmployees } from '../../../features/employee/employeeSlice';
import { fetchAttendanceHistory } from '../../../features/attendance/attendanceSlice';

const AttendanceReport = () => {
  const dispatch = useDispatch();
  
  // --- REDUX STATE ---
  const { items: employees, status: empStatus } = useSelector(state => state.employees);
  const { history: attendanceHistory, status: historyStatus } = useSelector(state => state.attendance);
  
  // --- LOCAL STATE ---
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch All Employees on Load
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // 2. Select First Employee by Default & Fetch History
  useEffect(() => {
    if (employees.length > 0 && !selectedEmp) {
      const firstEmp = employees[0];
      setSelectedEmp(firstEmp);
      dispatch(fetchAttendanceHistory(firstEmp.id));
    }
  }, [employees, dispatch, selectedEmp]);

  // 3. Handle User Click
  const handleSelectEmployee = (emp) => {
    setSelectedEmp(emp);
    dispatch(fetchAttendanceHistory(emp.id));
  };

  // Filter Logic
  const filteredEmployees = employees?.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- FORMATTERS ---
  const formatDate = (isoStr) => {
    if (!isoStr) return '--';
    return new Date(isoStr).toLocaleDateString('en-US', { 
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  const formatTime = (isoStr) => {
    if (!isoStr) return '--:--';
    return new Date(isoStr).toLocaleTimeString('en-US', { 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] bg-slate-50 gap-6 p-6 font-sans">
      
      {/* ================= LEFT PANEL: EMPLOYEE LIST ================= */}
      <div className="lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full">
        
        {/* Header & Search */}
        <div className="p-5 border-b border-slate-100 bg-white z-10 shrink-0">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Team Members</h2>
          <p className="text-xs text-slate-500 mb-4">Select an employee to view records</p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {empStatus === 'loading' && !employees.length ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-600" /></div>
          ) : filteredEmployees?.map(emp => (
            <button
              key={emp.id}
              onClick={() => handleSelectEmployee(emp)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border text-left
                ${selectedEmp?.id === emp.id 
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                  : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                }`}
            >
              {/* Avatar Initials */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border
                 ${selectedEmp?.id === emp.id 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'}
              `}>
                {emp.name?.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm truncate ${selectedEmp?.id === emp.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {emp.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate mt-0.5">
                    <Briefcase size={10} />
                    {/* Assuming role/dept are IDs, ideally fetch names or leave simple */}
                    <span>{emp.role_name || emp.email}</span> 
                </div>
              </div>
              
              {selectedEmp?.id === emp.id && <ChevronRight size={16} className="text-indigo-500 shrink-0" />}
            </button>
          ))}
          
          {filteredEmployees?.length === 0 && empStatus !== 'loading' && (
              <p className="text-center text-slate-400 text-sm py-4">No employees found.</p>
          )}
        </div>
      </div>

      {/* ================= RIGHT PANEL: ATTENDANCE HISTORY ================= */}
      <div className="lg:w-2/3 flex flex-col gap-6 h-full overflow-hidden">
        
        {selectedEmp ? (
            <>
                {/* User Profile Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                        {selectedEmp.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">{selectedEmp.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs"><User size={12} /> ID: {selectedEmp.id}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {selectedEmp.city || 'Office'}</span>
                        </div>
                    </div>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    <Download size={16} /> Export Report
                </button>
                </div>

                {/* History Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30 shrink-0">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={18} className="text-slate-400"/> Attendance History
                    </h3>
                    <div className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                        Total Records: {attendanceHistory?.length || 0}
                    </div>
                </div>

                <div className="overflow-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold sticky top-0 z-10">
                            <tr>
                            <th className="p-4 pl-6">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Check In</th>
                            <th className="p-4">Check Out</th>
                            <th className="p-4">Work Hours</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {historyStatus === 'loading' ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center">
                                        <div className="flex justify-center items-center gap-2 text-indigo-600">
                                            <Loader2 className="animate-spin" size={20} /> Loading records...
                                        </div>
                                    </td>
                                </tr>
                            ) : attendanceHistory && attendanceHistory.length > 0 ? (
                                attendanceHistory.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 pl-6 font-medium text-slate-700">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            {formatDate(record.created_at || record.clock_in)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {/* Logic to determine status based on time or manual field */}
                                        <StatusBadge 
                                            isPresent={!!record.clock_in} 
                                            isHalfDay={record.total_hours && parseFloat(record.total_hours) < 4}
                                        />
                                    </td>
                                    <td className="p-4 text-emerald-600 font-mono font-medium bg-emerald-50/0 group-hover:bg-emerald-50/30 rounded-lg transition-colors">
                                        {formatTime(record.clock_in)}
                                    </td>
                                    <td className="p-4 text-rose-500 font-mono font-medium bg-rose-50/0 group-hover:bg-rose-50/30 rounded-lg transition-colors">
                                        {formatTime(record.clock_out)}
                                    </td>
                                    <td className="p-4 font-bold text-slate-700">
                                        {record.total_hours === "0.00" ? (
                                            <span className="text-amber-500 text-xs uppercase tracking-wide">Active</span>
                                        ) : (
                                            <span>{record.total_hours} <span className="text-slate-400 text-xs font-normal">hrs</span></span>
                                        )}
                                    </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-16 text-center text-slate-400">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Calendar size={32} className="opacity-50" />
                                        </div>
                                        <p>No attendance records found for this user.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                <User size={48} className="mb-4 opacity-50" />
                <p>Please select an employee from the list to view detailed reports.</p>
            </div>
        )}

      </div>
    </div>
  );
};

// --- Helper Component ---
const StatusBadge = ({ isPresent, isHalfDay }) => {
  if (!isPresent) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-rose-50 text-rose-700 border-rose-100">Absent</span>;
  }
  if (isHalfDay) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-100">Half Day</span>;
  }
  return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-100">Present</span>;
};

export default AttendanceReport;