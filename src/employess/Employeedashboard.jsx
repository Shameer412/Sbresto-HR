// // EmployeeDashboard.jsx
// import React, { useState, useEffect } from "react";

// // Import images (you'll need to add these to your project)
// // For demo, I'm using placeholder URLs - replace with your actual images
// const profileImage =
//   "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
// const companyLogo =
//   "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop";
// const dashboardBg =
//   "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop";

// const EmployeeDashboard = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [isClockedIn, setIsClockedIn] = useState(false);
//   const [clockInTime, setClockInTime] = useState(null);
//   const [workHours, setWorkHours] = useState(0);
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState({
//     show: false,
//     message: "",
//     type: "",
//   });

//   // Mock API data - Replace with actual API calls
//   const [employeeData, setEmployeeData] = useState({
//     id: "EMP-2023-001",
//     name: "John Doe",
//     email: "john.doe@company.com",
//     phone: "+1 (555) 123-4567",
//     department: "Engineering",
//     position: "Senior Software Developer",
//     joinDate: "2022-01-15",
//     salary: 4700,
//     leaveBalance: 12,
//   });

//   const [attendanceData, setAttendanceData] = useState([
//     {
//       id: 1,
//       date: "2023-03-15",
//       clockIn: "09:00 AM",
//       clockOut: "05:30 PM",
//       hours: 8.5,
//       status: "Present",
//     },
//     {
//       id: 2,
//       date: "2023-03-14",
//       clockIn: "09:15 AM",
//       clockOut: "05:45 PM",
//       hours: 8.5,
//       status: "Present",
//     },
//     {
//       id: 3,
//       date: "2023-03-13",
//       clockIn: "08:45 AM",
//       clockOut: "05:15 PM",
//       hours: 8.5,
//       status: "Present",
//     },
//     {
//       id: 4,
//       date: "2023-03-12",
//       clockIn: "-",
//       clockOut: "-",
//       hours: 0,
//       status: "Weekend",
//     },
//     {
//       id: 5,
//       date: "2023-03-11",
//       clockIn: "-",
//       clockOut: "-",
//       hours: 0,
//       status: "Weekend",
//     },
//   ]);

//   const [salarySlips, setSalarySlips] = useState([
//     {
//       id: 1,
//       month: "January 2023",
//       amount: 4500,
//       status: "Paid",
//       downloadUrl: "#",
//     },
//     {
//       id: 2,
//       month: "February 2023",
//       amount: 4500,
//       status: "Paid",
//       downloadUrl: "#",
//     },
//     {
//       id: 3,
//       month: "March 2023",
//       amount: 4700,
//       status: "Pending",
//       downloadUrl: "#",
//     },
//   ]);

//   // Show notification
//   const showNotification = (message, type = "success") => {
//     setNotification({ show: true, message, type });
//     setTimeout(
//       () => setNotification({ show: false, message: "", type: "" }),
//       3000
//     );
//   };

//   // Update current time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());

//       // Calculate work hours if clocked in
//       if (isClockedIn && clockInTime) {
//         const diffMs = new Date() - new Date(clockInTime);
//         const diffHrs = diffMs / (1000 * 60 * 60);
//         setWorkHours(parseFloat(diffHrs.toFixed(2)));
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [isClockedIn, clockInTime]);

//   // Simulate API call for clock in/out
//   const handleClockAction = async () => {
//     setIsLoading(true);

//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     if (isClockedIn) {
//       // Clock out API call would go here
//       setIsClockedIn(false);
//       setClockInTime(null);
//       setWorkHours(0);
//       showNotification("Successfully clocked out!", "success");
//     } else {
//       // Clock in API call would go here
//       setIsClockedIn(true);
//       const now = new Date();
//       setClockInTime(now);

//       // Add to attendance data
//       const newAttendance = {
//         id: attendanceData.length + 1,
//         date: now.toISOString().split("T")[0],
//         clockIn: now.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//         clockOut: "-",
//         hours: 0,
//         status: "Present",
//       };
//       setAttendanceData([newAttendance, ...attendanceData]);

//       showNotification("Successfully clocked in!", "success");
//     }

//     setIsLoading(false);
//   };

//   // Simulate API call for downloading salary slip
//   const handleDownloadSalarySlip = async (slipId) => {
//     setIsLoading(true);
//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     showNotification("Salary slip downloaded successfully!", "success");
//     setIsLoading(false);
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   // Calculate next payday (1st of next month)
//   const getNextPayday = () => {
//     const today = new Date();
//     const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
//     return nextMonth;
//   };

//   // Calculate days until next payday
//   const getDaysUntilPayday = () => {
//     const today = new Date();
//     const payday = getNextPayday();
//     const diffTime = payday - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
//       {/* Notification */}
//       {notification.show && (
//         <div
//           className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transform transition-transform duration-300 ${
//             notification.type === "success" ? "bg-green-500" : "bg-red-500"
//           } text-white animate-bounce-in`}
//         >
//           {notification.message}
//         </div>
//       )}

//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
//             <p className="text-gray-700">Processing...</p>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <header className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex justify-between items-center animate-fade-in">
//         <div className="flex items-center space-x-4">
//           <img
//             src={companyLogo}
//             alt="Company Logo"
//             className="w-12 h-12 rounded-xl object-cover"
//           />
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               Employee Portal
//             </h1>
//             <p className="text-gray-600">Welcome back, {employeeData.name}</p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="text-right hidden md:block">
//             <p className="text-sm text-gray-500">
//               {currentTime.toLocaleDateString("en-US", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </p>
//             <p className="font-semibold text-lg">
//               {currentTime.toLocaleTimeString()}
//             </p>
//           </div>
//           <div className="relative group">
//             <img
//               src={profileImage}
//               alt="Profile"
//               className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 cursor-pointer transform transition-transform group-hover:scale-110"
//             />
//             <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
//               <span className="text-white text-xs">✓</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Sidebar Navigation */}
//         <div className="lg:col-span-1">
//           <nav className="bg-white rounded-2xl shadow-lg p-4 sticky top-6 animate-slide-in-left">
//             <ul className="space-y-2">
//               {[
//                 { id: "dashboard", label: "Dashboard", icon: "📊" },
//                 { id: "attendance", label: "Attendance", icon: "⏱️" },
//                 { id: "salary", label: "Salary", icon: "💰" },
//                 { id: "profile", label: "Profile", icon: "👤" },
//               ].map((item) => (
//                 <li key={item.id}>
//                   <button
//                     onClick={() => setActiveTab(item.id)}
//                     className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center space-x-4 group ${
//                       activeTab === item.id
//                         ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
//                         : "text-gray-600 hover:bg-gray-100 hover:transform hover:scale-105"
//                     }`}
//                   >
//                     <span className="text-xl transition-transform group-hover:scale-125">
//                       {item.icon}
//                     </span>
//                     <span className="font-medium">{item.label}</span>
//                   </button>
//                 </li>
//               ))}
//             </ul>

//             {/* Quick Stats */}
//             <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
//               <h3 className="font-semibold text-gray-700 mb-3">Quick Stats</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">This Month:</span>
//                   <span className="font-semibold">18/21 days</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Late Arrivals:</span>
//                   <span className="font-semibold text-green-600">0</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Overtime:</span>
//                   <span className="font-semibold text-blue-600">4.5 hrs</span>
//                 </div>
//               </div>
//             </div>
//           </nav>
//         </div>

//         {/* Main Content Area */}
//         <div className="lg:col-span-3">
//           {/* Dashboard Tab */}
//           {activeTab === "dashboard" && (
//             <div className="space-y-6 animate-fade-in">
//               {/* Hero Banner */}
//               <div
//                 className="relative rounded-2xl shadow-lg overflow-hidden h-48 bg-cover bg-center"
//                 style={{ backgroundImage: `url(${dashboardBg})` }}
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70"></div>
//                 <div className="absolute inset-0 flex items-center justify-center text-white p-6">
//                   <div className="text-center">
//                     <h2 className="text-3xl font-bold mb-2">
//                       Welcome to Your Dashboard
//                     </h2>
//                     <p className="text-blue-100">
//                       Manage your work schedule, view salary details, and track
//                       your progress
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-float">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500">Work Hours Today</p>
//                       <p className="text-3xl font-bold text-gray-800">
//                         {workHours} hrs
//                       </p>
//                     </div>
//                     <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center animate-pulse">
//                       <span className="text-blue-500 text-2xl">⏰</span>
//                     </div>
//                   </div>
//                   <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
//                       style={{
//                         width: `${Math.min((workHours / 8) * 100, 100)}%`,
//                       }}
//                     ></div>
//                   </div>
//                 </div>

//                 <div
//                   className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-float"
//                   style={{ animationDelay: "0.2s" }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500">Monthly Salary</p>
//                       <p className="text-3xl font-bold text-gray-800">
//                         {formatCurrency(employeeData.salary)}
//                       </p>
//                     </div>
//                     <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                       <span className="text-green-500 text-2xl">💰</span>
//                     </div>
//                   </div>
//                   <p className="text-sm text-green-600 mt-2">
//                     +5% from last month
//                   </p>
//                 </div>

//                 <div
//                   className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-float"
//                   style={{ animationDelay: "0.4s" }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500">Leave Balance</p>
//                       <p className="text-3xl font-bold text-gray-800">
//                         {employeeData.leaveBalance} days
//                       </p>
//                     </div>
//                     <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
//                       <span className="text-yellow-500 text-2xl">🏖️</span>
//                     </div>
//                   </div>
//                   <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
//                     Apply for Leave →
//                   </button>
//                 </div>
//               </div>

//               {/* Clock In/Out and Recent Activity */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Clock In/Out Card */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6">
//                   <div className="flex flex-col items-center justify-between h-full">
//                     <div className="text-center mb-6">
//                       <h2 className="text-xl font-bold text-gray-800 mb-2">
//                         Today's Attendance
//                       </h2>
//                       <p className="text-gray-600">
//                         {isClockedIn
//                           ? "You are currently clocked in"
//                           : "You are currently clocked out"}
//                       </p>
//                     </div>

//                     <div className="text-center mb-6">
//                       <div className="text-5xl font-bold mb-2 text-gray-800">
//                         {currentTime.toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </div>
//                       <p className="text-gray-500">
//                         {currentTime.toLocaleDateString()}
//                       </p>
//                     </div>

//                     <button
//                       onClick={handleClockAction}
//                       disabled={isLoading}
//                       className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 ${
//                         isClockedIn
//                           ? "bg-red-500 hover:bg-red-600"
//                           : "bg-green-500 hover:bg-green-600"
//                       } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//                     >
//                       {isLoading ? (
//                         <span className="flex items-center justify-center">
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                           Processing...
//                         </span>
//                       ) : isClockedIn ? (
//                         "Clock Out Now"
//                       ) : (
//                         "Clock In Now"
//                       )}
//                     </button>

//                     {isClockedIn && clockInTime && (
//                       <div className="mt-4 p-3 bg-blue-50 rounded-xl w-full text-center">
//                         <p className="text-blue-700 font-medium">
//                           Clocked in at: {clockInTime.toLocaleTimeString()}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Recent Activity */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6">
//                   <h2 className="text-xl font-bold text-gray-800 mb-4">
//                     Recent Activity
//                   </h2>
//                   <div className="space-y-4">
//                     {[
//                       {
//                         action: "Clocked In",
//                         time: "Today, 9:00 AM",
//                         type: "attendance",
//                         icon: "🟢",
//                       },
//                       {
//                         action: "Salary Paid",
//                         time: "March 1, 2023",
//                         type: "salary",
//                         icon: "💰",
//                       },
//                       {
//                         action: "Profile Updated",
//                         time: "February 28, 2023",
//                         type: "profile",
//                         icon: "👤",
//                       },
//                       {
//                         action: "Leave Approved",
//                         time: "February 20, 2023",
//                         type: "leave",
//                         icon: "✅",
//                       },
//                     ].map((activity, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 transform hover:translate-x-2"
//                       >
//                         <div className="text-2xl mr-3">{activity.icon}</div>
//                         <div className="flex-1">
//                           <p className="font-medium">{activity.action}</p>
//                           <p className="text-sm text-gray-500">
//                             {activity.time}
//                           </p>
//                         </div>
//                         <div
//                           className={`w-2 h-2 rounded-full ${
//                             activity.type === "attendance"
//                               ? "bg-green-500"
//                               : activity.type === "salary"
//                               ? "bg-blue-500"
//                               : activity.type === "profile"
//                               ? "bg-purple-500"
//                               : "bg-yellow-500"
//                           }`}
//                         ></div>
//                       </div>
//                     ))}
//                   </div>
//                   <button className="w-full mt-4 text-center text-indigo-600 hover:text-indigo-800 font-medium py-2">
//                     View All Activity →
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Attendance Tab */}
//           {activeTab === "attendance" && (
//             <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//                 <h2 className="text-xl font-bold text-gray-800">
//                   Attendance History
//                 </h2>
//                 <div className="flex space-x-2 mt-2 md:mt-0">
//                   <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
//                     This Month
//                   </button>
//                   <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                     Export
//                   </button>
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Clock In
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Clock Out
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Hours
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {attendanceData.map((record, index) => (
//                       <tr
//                         key={record.id}
//                         className="hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
//                         style={{ animationDelay: `${index * 0.1}s` }}
//                       >
//                         <td className="px-4 py-3 whitespace-nowrap">
//                           {new Date(record.date).toLocaleDateString("en-US", {
//                             weekday: "short",
//                             month: "short",
//                             day: "numeric",
//                           })}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap font-medium">
//                           {record.clockIn}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap font-medium">
//                           {record.clockOut}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap">
//                           {record.hours}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap">
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-medium ${
//                               record.status === "Present"
//                                 ? "bg-green-100 text-green-800"
//                                 : record.status === "Weekend"
//                                 ? "bg-blue-100 text-blue-800"
//                                 : "bg-red-100 text-red-800"
//                             }`}
//                           >
//                             {record.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="mt-6 flex justify-between items-center">
//                 <p className="text-gray-600">
//                   Showing {attendanceData.length} records
//                 </p>
//                 <div className="flex space-x-2">
//                   <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                     Previous
//                   </button>
//                   <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Salary Tab */}
//           {activeTab === "salary" && (
//             <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
//               <h2 className="text-xl font-bold text-gray-800 mb-6">
//                 Salary Information
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                 <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white transform transition-transform hover:scale-105">
//                   <h3 className="text-lg font-semibold mb-2">Current Salary</h3>
//                   <p className="text-3xl font-bold">
//                     {formatCurrency(employeeData.salary)}
//                   </p>
//                   <p className="text-blue-100">Per month</p>
//                   <div className="mt-4 flex items-center">
//                     <span className="text-green-300 text-sm">
//                       ↑ 5% increase
//                     </span>
//                     <span className="text-blue-200 text-sm ml-2">
//                       From last month
//                     </span>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white transform transition-transform hover:scale-105">
//                   <h3 className="text-lg font-semibold mb-2">Next Payday</h3>
//                   <p className="text-3xl font-bold">
//                     {getNextPayday().toLocaleDateString("en-US", {
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </p>
//                   <p className="text-green-100">
//                     {getDaysUntilPayday()} days remaining
//                   </p>
//                   <div className="mt-4 w-full bg-green-400/30 rounded-full h-2">
//                     <div
//                       className="bg-white h-2 rounded-full"
//                       style={{
//                         width: `${((30 - getDaysUntilPayday()) / 30) * 100}%`,
//                       }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>

//               <h3 className="text-lg font-semibold mb-4">Salary Slips</h3>
//               <div className="space-y-4">
//                 {salarySlips.map((slip, index) => (
//                   <div
//                     key={slip.id}
//                     className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 animate-fade-in"
//                     style={{ animationDelay: `${index * 0.1}s` }}
//                   >
//                     <div className="flex items-center">
//                       <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
//                         <span className="text-indigo-500 text-xl">💰</span>
//                       </div>
//                       <div>
//                         <p className="font-medium">{slip.month}</p>
//                         <p className="text-gray-600">
//                           {formatCurrency(slip.amount)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm ${
//                           slip.status === "Paid"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {slip.status}
//                       </span>
//                       <button
//                         onClick={() => handleDownloadSalarySlip(slip.id)}
//                         className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
//                       >
//                         <span className="mr-1">Download</span>
//                         <span>↓</span>
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Profile Tab */}
//           {activeTab === "profile" && (
//             <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
//               <h2 className="text-xl font-bold text-gray-800 mb-6">
//                 Personal Information
//               </h2>

//               <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6 mb-8">
//                 <div className="flex flex-col items-center">
//                   <div className="relative">
//                     <img
//                       src={profileImage}
//                       alt="Profile"
//                       className="w-32 h-32 rounded-2xl object-cover border-4 border-indigo-100 shadow-lg"
//                     />
//                     <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors transform hover:scale-110">
//                       <span className="text-sm">✎</span>
//                     </button>
//                   </div>
//                   <h3 className="mt-4 text-lg font-bold text-gray-800">
//                     {employeeData.name}
//                   </h3>
//                   <p className="text-gray-600">{employeeData.position}</p>
//                   <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//                     Active
//                   </div>
//                 </div>

//                 <div className="flex-1">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Full Name
//                       </label>
//                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//                         {employeeData.name}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Employee ID
//                       </label>
//                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//                         {employeeData.id}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Email
//                       </label>
//                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//                         {employeeData.email}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Phone
//                       </label>
//                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//                         {employeeData.phone}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Department
//                       </label>
//                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//                         {employeeData.department}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Position
//                       </label>
//                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//                         {employeeData.position}
//                       </div>
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Join Date
//                       </label>
//                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//                         {new Date(employeeData.joinDate).toLocaleDateString(
//                           "en-US",
//                           { year: "numeric", month: "long", day: "numeric" }
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-6 flex space-x-4">
//                     <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center">
//                       <span className="mr-2">✎</span> Edit Profile
//                     </button>
//                     <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-300">
//                       Change Password
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="mt-8 text-center text-gray-500 text-sm">
//         <p>© 2023 Company Name. All rights reserved. Employee Portal v1.0</p>
//       </footer>
//     </div>
//   );
// };

// export default EmployeeDashboard;

// ------------------------------------------------------------------------------------
// EmployeeDashboard.jsx
import React, { useState, useEffect } from "react";

// Import images (you'll need to add these to your project)
// For demo, I'm using placeholder URLs - replace with your actual images
const profileImage =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
const companyLogo =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop";
const dashboardBg =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop";

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [workHours, setWorkHours] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock API data - Replace with actual API calls
  const [employeeData, setEmployeeData] = useState({
    id: "EMP-2023-001",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    position: "Senior Software Developer",
    joinDate: "2022-01-15",
    salary: 4700,
    leaveBalance: 12,
  });

  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      date: "2023-03-15",
      clockIn: "09:00 AM",
      clockOut: "05:30 PM",
      hours: 8.5,
      status: "Present",
    },
    {
      id: 2,
      date: "2023-03-14",
      clockIn: "09:15 AM",
      clockOut: "05:45 PM",
      hours: 8.5,
      status: "Present",
    },
    {
      id: 3,
      date: "2023-03-13",
      clockIn: "08:45 AM",
      clockOut: "05:15 PM",
      hours: 8.5,
      status: "Present",
    },
    {
      id: 4,
      date: "2023-03-12",
      clockIn: "-",
      clockOut: "-",
      hours: 0,
      status: "Weekend",
    },
    {
      id: 5,
      date: "2023-03-11",
      clockIn: "-",
      clockOut: "-",
      hours: 0,
      status: "Weekend",
    },
  ]);

  const [salarySlips, setSalarySlips] = useState([
    {
      id: 1,
      month: "January 2023",
      amount: 4500,
      status: "Paid",
      downloadUrl: "#",
    },
    {
      id: 2,
      month: "February 2023",
      amount: 4500,
      status: "Paid",
      downloadUrl: "#",
    },
    {
      id: 3,
      month: "March 2023",
      amount: 4700,
      status: "Pending",
      downloadUrl: "#",
    },
  ]);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      // Calculate work hours if clocked in
      if (isClockedIn && clockInTime) {
        const diffMs = new Date() - new Date(clockInTime);
        const diffHrs = diffMs / (1000 * 60 * 60);
        setWorkHours(parseFloat(diffHrs.toFixed(2)));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isClockedIn, clockInTime]);

  // Simulate API call for clock in/out
  const handleClockAction = async () => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isClockedIn) {
      // Clock out API call would go here
      setIsClockedIn(false);
      setClockInTime(null);
      setWorkHours(0);
      showNotification("Successfully clocked out!", "success");
    } else {
      // Clock in API call would go here
      setIsClockedIn(true);
      const now = new Date();
      setClockInTime(now);

      // Add to attendance data
      const newAttendance = {
        id: attendanceData.length + 1,
        date: now.toISOString().split("T")[0],
        clockIn: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        clockOut: "-",
        hours: 0,
        status: "Present",
      };
      setAttendanceData([newAttendance, ...attendanceData]);

      showNotification("Successfully clocked in!", "success");
    }

    setIsLoading(false);
  };

  // Simulate API call for downloading salary slip
  const handleDownloadSalarySlip = async (slipId) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    showNotification("Salary slip downloaded successfully!", "success");
    setIsLoading(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate next payday (1st of next month)
  const getNextPayday = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth;
  };

  // Calculate days until next payday
  const getDaysUntilPayday = () => {
    const today = new Date();
    const payday = getNextPayday();
    const diffTime = payday - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transform transition-transform duration-300 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white animate-bounce-in max-w-xs sm:max-w-sm`}
        >
          {notification.message}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl flex flex-col items-center mx-4">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600 mb-3 sm:mb-4"></div>
            <p className="text-gray-700 text-sm sm:text-base">Processing...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6 flex justify-between items-center animate-fade-in">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl object-cover"
          />
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              Employee Portal
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Welcome back, {employeeData.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-right hidden xs:block">
            <p className="text-xs sm:text-sm text-gray-500">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="font-semibold text-sm sm:text-lg">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span className="text-xl">☰</span>
          </button>

          <div className="relative group">
            <img
              src={profileImage}
              alt="Profile"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-indigo-500 cursor-pointer transform transition-transform group-hover:scale-110"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar Navigation - Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          >
            <div
              className="absolute right-0 top-0 h-full w-3/4 max-w-sm bg-white p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Menu</h2>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              <ul className="space-y-2">
                {[
                  { id: "dashboard", label: "Dashboard", icon: "📊" },
                  { id: "attendance", label: "Attendance", icon: "⏱️" },
                  { id: "salary", label: "Salary", icon: "💰" },
                  { id: "profile", label: "Profile", icon: "👤" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center space-x-4 group ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                          : "text-gray-600 hover:bg-gray-100 hover:transform hover:scale-105"
                      }`}
                    >
                      <span className="text-xl transition-transform group-hover:scale-125">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Quick Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">This Month:</span>
                    <span className="font-semibold">18/21 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Late Arrivals:</span>
                    <span className="font-semibold text-green-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overtime:</span>
                    <span className="font-semibold text-blue-600">4.5 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Navigation - Desktop */}
        <div className="lg:col-span-1 hidden lg:block">
          <nav className="bg-white rounded-2xl shadow-lg p-4 sticky top-6 animate-slide-in-left">
            <ul className="space-y-2">
              {[
                { id: "dashboard", label: "Dashboard", icon: "📊" },
                { id: "attendance", label: "Attendance", icon: "⏱️" },
                { id: "salary", label: "Salary", icon: "💰" },
                { id: "profile", label: "Profile", icon: "👤" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center space-x-4 group ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:bg-gray-100 hover:transform hover:scale-105"
                    }`}
                  >
                    <span className="text-xl transition-transform group-hover:scale-125">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-gray-700 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month:</span>
                  <span className="font-semibold">18/21 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Late Arrivals:</span>
                  <span className="font-semibold text-green-600">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overtime:</span>
                  <span className="font-semibold text-blue-600">4.5 hrs</span>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              {/* Hero Banner */}
              <div
                className="relative rounded-2xl shadow-lg overflow-hidden h-32 sm:h-40 md:h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${dashboardBg})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white p-4 sm:p-6">
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
                      Welcome to Your Dashboard
                    </h2>
                    <p className="text-blue-100 text-xs sm:text-sm">
                      Manage your work schedule, view salary details, and track
                      your progress
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-float">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm sm:text-base">
                        Work Hours Today
                      </p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                        {workHours} hrs
                      </p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center animate-pulse">
                      <span className="text-blue-500 text-lg sm:text-xl md:text-2xl">
                        ⏰
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min((workHours / 8) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div
                  className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-float"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm sm:text-base">
                        Monthly Salary
                      </p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                        {formatCurrency(employeeData.salary)}
                      </p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-green-500 text-lg sm:text-xl md:text-2xl">
                        💰
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-green-600 mt-2">
                    +5% from last month
                  </p>
                </div>

                <div
                  className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-float"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm sm:text-base">
                        Leave Balance
                      </p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                        {employeeData.leaveBalance} days
                      </p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <span className="text-yellow-500 text-lg sm:text-xl md:text-2xl">
                        🏖️
                      </span>
                    </div>
                  </div>
                  <button className="mt-2 sm:mt-3 text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Apply for Leave →
                  </button>
                </div>
              </div>

              {/* Clock In/Out and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Clock In/Out Card */}
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                  <div className="flex flex-col items-center justify-between h-full">
                    <div className="text-center mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                        Today's Attendance
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {isClockedIn
                          ? "You are currently clocked in"
                          : "You are currently clocked out"}
                      </p>
                    </div>

                    <div className="text-center mb-4 sm:mb-6">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 text-gray-800">
                        {currentTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <p className="text-gray-500 text-sm">
                        {currentTime.toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={handleClockAction}
                      disabled={isLoading}
                      className={`w-full py-3 sm:py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                        isClockedIn
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center text-sm sm:text-base">
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </span>
                      ) : isClockedIn ? (
                        "Clock Out Now"
                      ) : (
                        "Clock In Now"
                      )}
                    </button>

                    {isClockedIn && clockInTime && (
                      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-xl w-full text-center">
                        <p className="text-blue-700 font-medium text-sm sm:text-base">
                          Clocked in at: {clockInTime.toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                    Recent Activity
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        action: "Clocked In",
                        time: "Today, 9:00 AM",
                        type: "attendance",
                        icon: "🟢",
                      },
                      {
                        action: "Salary Paid",
                        time: "March 1, 2023",
                        type: "salary",
                        icon: "💰",
                      },
                      {
                        action: "Profile Updated",
                        time: "February 28, 2023",
                        type: "profile",
                        icon: "👤",
                      },
                      {
                        action: "Leave Approved",
                        time: "February 20, 2023",
                        type: "leave",
                        icon: "✅",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 transform hover:translate-x-1 sm:hover:translate-x-2"
                      >
                        <div className="text-xl sm:text-2xl mr-2 sm:mr-3">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">
                            {activity.action}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "attendance"
                              ? "bg-green-500"
                              : activity.type === "salary"
                              ? "bg-blue-500"
                              : activity.type === "profile"
                              ? "bg-purple-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3 sm:mt-4 text-center text-indigo-600 hover:text-indigo-800 font-medium py-2 text-sm sm:text-base">
                    View All Activity →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                  Attendance History
                </h2>
                <div className="flex space-x-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-3 py-2 text-sm sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    This Month
                  </button>
                  <button className="flex-1 sm:flex-none px-3 py-2 text-sm sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock In
                      </th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock Out
                      </th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours
                      </th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendanceData.map((record, index) => (
                      <tr
                        key={record.id}
                        className="hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-medium text-sm">
                          {record.clockIn}
                        </td>
                        <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-medium text-sm">
                          {record.clockOut}
                        </td>
                        <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm">
                          {record.hours}
                        </td>
                        <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-full font-medium ${
                              record.status === "Present"
                                ? "bg-green-100 text-green-800"
                                : record.status === "Weekend"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                <p className="text-gray-600 text-sm">
                  Showing {attendanceData.length} records
                </p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Salary Tab */}
          {activeTab === "salary" && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 animate-fade-in">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                Salary Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white transform transition-transform hover:scale-105">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    Current Salary
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {formatCurrency(employeeData.salary)}
                  </p>
                  <p className="text-blue-100 text-sm">Per month</p>
                  <div className="mt-3 sm:mt-4 flex items-center">
                    <span className="text-green-300 text-xs sm:text-sm">
                      ↑ 5% increase
                    </span>
                    <span className="text-blue-200 text-xs sm:text-sm ml-2">
                      From last month
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-4 sm:p-6 text-white transform transition-transform hover:scale-105">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    Next Payday
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {getNextPayday().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-green-100 text-sm">
                    {getDaysUntilPayday()} days remaining
                  </p>
                  <div className="mt-3 sm:mt-4 w-full bg-green-400/30 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full"
                      style={{
                        width: `${((30 - getDaysUntilPayday()) / 30) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3 sm:mb-4">
                Salary Slips
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {salarySlips.map((slip, index) => (
                  <div
                    key={slip.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                        <span className="text-indigo-500 text-lg sm:text-xl">
                          💰
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">
                          {slip.month}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {formatCurrency(slip.amount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                      <span
                        className={`px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-full ${
                          slip.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {slip.status}
                      </span>
                      <button
                        onClick={() => handleDownloadSalarySlip(slip.id)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center text-sm sm:text-base"
                      >
                        <span className="mr-1">Download</span>
                        <span>↓</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 animate-fade-in">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                Personal Information
              </h2>

              <div className="flex flex-col md:flex-row items-start space-y-4 sm:space-y-6 md:space-y-0 md:space-x-4 lg:space-x-6 mb-6 sm:mb-8">
                <div className="flex flex-col items-center w-full md:w-auto">
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-indigo-100 shadow-lg"
                    />
                    <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 sm:p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors transform hover:scale-110">
                      <span className="text-xs sm:text-sm">✎</span>
                    </button>
                  </div>
                  <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-bold text-gray-800">
                    {employeeData.name}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {employeeData.position}
                  </p>
                  <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium">
                    Active
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 text-sm sm:text-base">
                        {employeeData.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee ID
                      </label>
                      <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 text-sm sm:text-base">
                        {employeeData.id}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 text-sm sm:text-base">
                        {employeeData.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 text-sm sm:text-base">
                        {employeeData.phone}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 text-sm sm:text-base">
                        {employeeData.department}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 text-sm sm:text-base">
                        {employeeData.position}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Join Date
                      </label>
                      <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 text-sm sm:text-base">
                        {new Date(employeeData.joinDate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <button className="bg-indigo-600 text-white px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center">
                      <span className="mr-2">✎</span> Edit Profile
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base rounded-lg hover:bg-gray-50 transition-colors duration-300">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 sm:mt-8 text-center text-gray-500 text-xs sm:text-sm">
        <p>© 2023 Company Name. All rights reserved. Employee Portal v1.0</p>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;
