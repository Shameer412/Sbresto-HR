import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Clock, LogIn, LogOut, Calendar, 
  CheckCircle, AlertCircle, Loader2,
  Timer, History, Briefcase, User, MapPin, Coffee
} from 'lucide-react';

// Real Redux Actions (Uncomment in real app)
import { 
  clockInEmployee, 
  clockOutEmployee, 
  fetchTodayAttendance,
  fetchAttendanceHistory,
  clearAttendanceMessage 
} from '../../../features/attendance/attendanceSlice';

const AttendanceDashboard = () => {
  const dispatch = useDispatch();
  
  // --- REDUX STATE ---
  const { user } = useSelector((state) => state.auth);
  const { status, error, message, currentStatus, record, history } = useSelector((state) => state.attendance);

  // ID Handling
  const employeeId = user?.employee_id || user?.id;

  // --- LOCAL STATE ---
  const [currentTime, setCurrentTime] = useState(new Date());
  const [validationError, setValidationError] = useState(null);
  const [workDuration, setWorkDuration] = useState("00:00:00");

  // 1. INITIAL FETCH
  useEffect(() => {
    if (employeeId) {
        dispatch(fetchTodayAttendance(employeeId));
        dispatch(fetchAttendanceHistory(employeeId));
    }
  }, [dispatch, employeeId]);

  // 2. LIVE CLOCK & DURATION LOGIC
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Duration Calculator
      if (currentStatus === 'clocked_in' && record?.clock_in) {
        const startTime = new Date(record.clock_in);
        const diff = now - startTime; 
        
        const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        
        setWorkDuration(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStatus, record]);

  // 3. AUTO CLEAR MESSAGES
  useEffect(() => {
    if (message || error || validationError) {
      const timeout = setTimeout(() => {
        dispatch(clearAttendanceMessage());
        setValidationError(null);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [message, error, validationError, dispatch]);

  // --- HANDLERS ---
  const handleClockIn = () => {
    if (!employeeId) { setValidationError("User ID missing."); return; }
    dispatch(clockInEmployee(employeeId));
  };

  const handleClockOut = () => {
    if (!employeeId) { setValidationError("User ID missing."); return; }
    dispatch(clockOutEmployee(employeeId));
  };

  // --- FORMATTERS ---
  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (timeStr) => {
      if (!timeStr) return '--:--';
      const date = new Date(timeStr);
      return isNaN(date.getTime()) ? '--:--' : date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[400px]">
      
      {/* ================= LEFT PANEL: ACTION ZONE (Dark Theme) ================= */}
      <div className="lg:w-5/12 bg-slate-900 text-white p-8 relative flex flex-col justify-between overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

        {/* Top: Date & Info */}
        <div className="relative z-10">
            <div className="flex items-center gap-2 text-indigo-300 font-medium text-sm mb-2">
                <Calendar size={16} /> {formatDate(currentTime)}
            </div>
            <div className="text-6xl font-bold font-mono tracking-tighter text-white mb-2">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin size={14} /> Remote / Office
            </div>
        </div>

        {/* Center: Live Status & Duration */}
        <div className="relative z-10 my-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Current Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 
                        ${currentStatus === 'clocked_in' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        <span className={`w-2 h-2 rounded-full ${currentStatus === 'clocked_in' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                        {currentStatus === 'clocked_in' ? 'Active' : 'Offline'}
                    </span>
                </div>
                
                <div className="text-center">
                    <div className="text-slate-400 text-xs uppercase mb-1">Session Duration</div>
                    <div className="text-4xl font-mono font-bold text-white tracking-widest">
                        {currentStatus === 'clocked_in' ? workDuration : '00:00:00'}
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom: Big Buttons & Alerts */}
        <div className="relative z-10">
            {/* Alert Message */}
            {(message || error || validationError) && (
                <div className={`mb-4 p-3 rounded-xl text-sm font-medium flex items-center gap-3
                    ${(error || validationError) ? 'bg-red-500/20 text-red-200 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'}
                `}>
                    {(error || validationError) ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                    <span>{validationError || error || message}</span>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={handleClockIn}
                    disabled={status === 'loading' || currentStatus === 'clocked_in'}
                    className={`h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all
                        ${currentStatus === 'clocked_in' 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                            : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-900/20 hover:-translate-y-1'}
                    `}
                >
                    {status === 'loading' && currentStatus !== 'clocked_in' ? <Loader2 className="animate-spin" /> : <LogIn />}
                    Clock In
                </button>

                <button
                    onClick={handleClockOut}
                    disabled={status === 'loading' || currentStatus === 'clocked_out' || currentStatus === 'unknown'}
                    className={`h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all
                        ${currentStatus === 'clocked_out' || currentStatus === 'unknown'
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                            : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20 hover:-translate-y-1'}
                    `}
                >
                    {status === 'loading' && currentStatus === 'clocked_in' ? <Loader2 className="animate-spin" /> : <LogOut />}
                    Clock Out
                </button>
            </div>
        </div>
      </div>

      {/* ================= RIGHT PANEL: STATS & TIMELINE (Light Theme) ================= */}
      <div className="lg:w-7/12 bg-white p-8 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Today's Activity</h2>
                <p className="text-slate-500 text-sm">Summary of your shift</p>
            </div>
            <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                <Briefcase size={16} /> {user?.name || 'Employee'}
            </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                    <LogIn size={16} />
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase">Punch In</span>
                <span className="text-lg font-bold text-slate-800 mt-1">
                    {record?.clock_in ? formatTime(record.clock_in) : '--:--'}
                </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
                    <LogOut size={16} />
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase">Punch Out</span>
                <span className="text-lg font-bold text-slate-800 mt-1">
                    {record?.clock_out ? formatTime(record.clock_out) : '--:--'}
                </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    <Timer size={16} />
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase">Total Hrs</span>
                <span className="text-lg font-bold text-slate-800 mt-1">
                    {currentStatus === 'clocked_in' ? 'Calculating...' : (record?.total_hours || '0.00')}
                </span>
            </div>
        </div>

        {/* Timeline History */}
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <History size={18} className="text-slate-400" />
                <h3 className="font-bold text-slate-700">Recent Logs</h3>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 space-y-4">
                {history && history.length > 0 ? (
                    history.map((item, index) => (
                        <div key={item.id} className="flex gap-4 group">
                            {/* Timeline Line */}
                            <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full border-2 z-10 bg-white
                                    ${index === 0 ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}
                                `}></div>
                                {index !== history.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-1"></div>}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-4 border-b border-slate-50 last:border-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">
                                            {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Shift Duration: <span className="font-semibold text-slate-700">{item.total_hours === "0.00" ? 'In Progress' : item.total_hours + ' hrs'}</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-3 text-right">
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase">In</div>
                                            <div className="text-xs font-mono text-emerald-600 font-bold">{formatTime(item.clock_in)}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase">Out</div>
                                            <div className="text-xs font-mono text-rose-500 font-bold">{formatTime(item.clock_out)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-32 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Coffee size={24} className="mb-2 opacity-50" />
                        <p className="text-sm">No attendance history found.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AttendanceDashboard;