import React, { useState, useEffect, useRef } from 'react';

const PayrollReceiptModal = ({ payroll, onClose }) => {
    const componentRef = useRef();

    const handlePrint = () => {
        const printContent = componentRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        // Simple Print Hack
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore event listeners
    };

    if (!payroll) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg">Salary Slip</h3>
                    <button onClick={onClose}><X size={20}/></button>
                </div>

                <div ref={componentRef} className="p-8 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold uppercase tracking-wide">SB Resto HR</h2>
                        <p className="text-sm text-gray-500">Official Salary Receipt</p>
                    </div>

                    <div className="mb-6 border-b pb-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Employee:</span>
                            <span className="font-bold">ID #{payroll.employee_id}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Month:</span>
                            <span className="font-bold">{payroll.month}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="uppercase text-xs font-bold border px-2 py-0.5 rounded">{payroll.status}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-green-700">
                            <span>Basic Salary</span>
                            <span className="font-medium">{Number(payroll.salary).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>Deductions</span>
                            <span>- {Number(payroll.deductions || 0).toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between text-red-600">
                            <span>Advances/Loans</span>
                            <span>- {((Number(payroll.advances || 0) + Number(payroll.loans || 0))).toLocaleString()}</span>
                        </div>

                        <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold">
                            <span>Net Payable</span>
                            <span>Rs {Number(payroll.net_salary).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-dashed text-center text-xs text-gray-400">
                        <p>Computer Generated Slip</p>
                        <p>{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                     <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">Close</button>
                     <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700">
                        <Printer size={16}/> Print Slip
                     </button>
                </div>
            </div>
        </div>
    );
};
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPayrolls,
  createPayroll,
  updatePayrollStatus,
  resetCreateStatus
} from '../../../features/payroll/payrollSlice';
import { fetchEmployees } from '../../../features/employee/employeeSlice';
import { fetchWorkSettings } from '../../../features/employee/workSettingsSlice';

import {
  Plus, Calendar, User, DollarSign,
  Trash2, Eye, CheckCircle, Save, X,
  ChevronRight, Loader2, Printer
} from 'lucide-react';

const PayrollComplete = () => {
  const dispatch = useDispatch();

  // --- 1. REDUX STATE ---
  const { payrolls, pagination, status, createStatus, error } = useSelector((state) => state.payroll);
  const { items: employees, status: empStatus } = useSelector((state) => state.employees);

  // --- 2. LOCAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParams, setSelectedParams] = useState(null); // For receipt
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false); // New loading state for step transition

  // Status Change Handler
  const handleStatusChange = async (id, newStatus) => {
      const originalStatus = payrolls.find(p => p.id === id)?.status;
      if(window.confirm(`Update status to ${newStatus}?`)) {
          try {
             await dispatch(updatePayrollStatus({ id, status: newStatus })).unwrap();
             // Success - UI updates automatically via Reducer
          } catch (err) {
              console.error("Status Update Failed", err);
              alert(`Failed to update status: ${err}`);
              // Optional: Revert UI if optimistic (current reducer handles optimistic-like via API response)
          }
      }
  };

  // Wizard State
  // Month format "YYYY-MM"
  const [config, setConfig] = useState({ month: new Date().toISOString().slice(0, 7), location: 'All' });
  const [selectedEmps, setSelectedEmps] = useState([]);
  const [calculationData, setCalculationData] = useState([]);

  // --- 3. FETCH DATA (Employees & Payroll List) ---
  useEffect(() => {
    dispatch(fetchPayrolls(1));
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.lastPage || 1)) {
        dispatch(fetchPayrolls(newPage));
    }
  }

  // Handle Create Success
  useEffect(() => {
    if (createStatus === 'succeeded') {
      setIsModalOpen(false);
      dispatch(resetCreateStatus());
      dispatch(fetchPayrolls()); // List refresh
      alert("Payroll Generated Successfully!");
    }
  }, [createStatus, dispatch]);


  // --- 4. WIZARD LOGIC ---

  const handleStartWizard = () => {
    setStep(1);
    setSelectedEmps([]);
    setIsModalOpen(true);
    // Ensure employees are loaded if not already
    if (employees.length === 0) dispatch(fetchEmployees());
  };

  const toggleSelection = (emp) => {
    if (selectedEmps.find(e => e.id === emp.id)) {
      setSelectedEmps(selectedEmps.filter(e => e.id !== emp.id));
    } else {
      setSelectedEmps([...selectedEmps, emp]);
    }
  };

  // Step 2: Initialize Calculation
  const goToCalculation = () => {
    if (selectedEmps.length === 0) return alert("Select at least one employee!");

    setIsCalculating(true);
    const calculatedData = [];

    // Loop through selected employees
    for (const emp of selectedEmps) {
        // User Requirement: "Pick salary from user detail, then divide by hour formula"
        // Formula: 8 hours * 5 days * 4 weeks = 160 hours
        const baseSalary = emp.basic_salary ? parseFloat(emp.basic_salary) : 0;

        // Default standard hours
        const defaultHours = 160;

        // Calculate Hourly Rate: Salary / 160
        // Use full salary as base, then reverse calculate rate
        const calculatedRate = defaultHours > 0 ? (baseSalary / defaultHours) : 0;

        calculatedData.push({
            ...emp,
            hourlyRate: calculatedRate, // Derived rate stored for calculation
            hours: defaultHours,
            advances: 0,
            loans: 0,
            deductions: 0,
            total: baseSalary // Net Pay = Base Salary initially
        });
    }

    setCalculationData(calculatedData);
    setIsCalculating(false);
    setStep(2);
  };

  // Handle Input Change inside Wizard
  const handleCalcChange = (id, field, value) => {
    const val = parseFloat(value) || 0;

    setCalculationData(prev => prev.map(item => {
      if (item.id === id) {
        let updatedItem = { ...item, [field]: val };

        // Formula: (Hours * Rate) - Advances - Loans - Deductions
        const grossSalary = updatedItem.hours * updatedItem.hourlyRate;
        // As per user request: Net Pay should strictly be equal to Salary (Gross) initially
        // Use standard subtraction if fields are edited, but default state implies Net = Basic
        updatedItem.total = grossSalary - updatedItem.advances - updatedItem.loans - updatedItem.deductions;


        return updatedItem;
      }
      return item;
    }));
  };

  // --- 5. SUBMIT PAYROLL (API: Loop for Single Requests) ---
  const submitPayroll = async () => {
    // API validation failed for bulk ("employee_id required"), so we send 1-by-1
    setIsCalculating(true); // Re-use loading state or create a new one

    try {
        const promises = calculationData.map(emp => {
            const payload = {
                employee_id: emp.id,
                month: config.month, // "YYYY-MM"
                salary: emp.hours * emp.hourlyRate, // Basic Salary
                advances: emp.advances,
                loans: emp.loans,
                deductions: emp.deductions,
                net_salary: emp.total, // Final calculated amount
                status: "pending"
            };
            // Dispatch returns a promise we can await
            return dispatch(createPayroll(payload)).unwrap();
        });

        await Promise.all(promises);

        // Success Handler
        setIsModalOpen(false);
        dispatch(fetchPayrolls()); // Refresh List
        alert("All Payrolls Generated Successfully!");

    } catch (err) {
        console.error("Submission Failed", err);
        // Error is already in Redux state if one failed, but we show alert too
        alert("Some payrolls failed to create. Check console or validation errors.");
    } finally {
        setIsCalculating(false);
    }
  };

  // --- UI RENDER ---

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payroll Dashboard</h1>
          <p className="text-gray-500">Manage monthly salaries and hours</p>
        </div>
        <button
          onClick={handleStartWizard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition"
        >
          <Plus size={20} /> Create New Payroll
        </button>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {typeof error === 'string' ? error : 'Something went wrong'}
        </div>
      )}

      {/* --- MAIN LIST VIEW (Fetched from API) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-700">Payroll History</h3>
          {status === 'loading' && <span className="text-sm text-blue-500">Refreshing...</span>}
        </div>

        <table className="w-full text-left border-collapse">
          {/* ... table content ... */}
          <thead>
            <tr className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
              <th className="px-6 py-3">Month</th>
              <th className="px-6 py-3">Emp ID</th>
              <th className="px-6 py-3">Basic Salary</th>
              <th className="px-6 py-3">Deductions</th>
              <th className="px-6 py-3">Net Pay</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payrolls && payrolls.length > 0 ? (
              payrolls.map((payroll, index) => (
                <tr key={payroll.id || index} className="hover:bg-blue-50 transition group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Calendar size={18} />
                    </div>
                    <span className="font-medium text-gray-700">{payroll.month}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">ID: {payroll.employee_id}</td>
                  <td className="px-6 py-4 text-gray-600">
                     {Number(payroll.salary).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-red-500">
                    - {Number(payroll.deductions || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    Rs {Number(payroll.net_salary).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <select
                        value={payroll.status || 'pending'}
                        onChange={(e) => handleStatusChange(payroll.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer outline-none appearance-none
                          ${payroll.status === 'paid' ? 'bg-green-100 text-green-700' :
                            payroll.status === 'due' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                        <option value="pending">Pending</option>
                        <option value="due">Due</option>
                        <option value="paid">Paid</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedParams(payroll)}
                        className="text-gray-400 hover:text-blue-600 transition"
                        title="Print Receipt"
                      >
                          <Printer size={18} />
                      </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  {status === 'loading' ? 'Loading payrolls...' : 'No payrolls found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION CONTROLS */}
        {pagination && pagination.lastPage > 1 && (
            <div className="px-6 py-4 border-t flex justify-between items-center bg-gray-50">
                <span className="text-sm text-gray-500">
                    Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} records)
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.lastPage}
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
                    >
                        Next
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* --- RECEIPT MODAL --- */}
      {selectedParams && (
          <PayrollReceiptModal payroll={selectedParams} onClose={() => setSelectedParams(null)} />
      )}

      {/* --- MODAL WIZARD --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {step === 1 ? 'Step 1: Select Employees & Month' : 'Step 2: Adjust Salaries'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* STEP 1: SELECT EMPLOYEES */}
              {step === 1 && (
                <div>
                  <div className="flex gap-4 mb-4">
                    <div className="w-1/3">
                      <label className="text-xs text-gray-500 mb-1 block">Month (YYYY-MM)</label>
                      <input
                        type="month"
                        className="border p-2 rounded w-full bg-white"
                        value={config.month}
                        onChange={(e) => setConfig({...config, month: e.target.value})}
                      />
                    </div>
                    {/* Location Filter Removed - Not in basic employee object usually, unless needed */}
                  </div>

                  {empStatus === 'loading' ? (
                      <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {employees && employees.length > 0 ? (
                            employees.map(emp => {
                            const isSelected = selectedEmps.find(s => s.id === emp.id);
                            return (
                                <div
                                key={emp.id}
                                onClick={() => toggleSelection(emp)}
                                className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center transition
                                    ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                                >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                                    <User size={20} />
                                    </div>
                                    <div>
                                    <p className="font-semibold text-gray-800">{emp.name}</p>
                                    <p className="text-xs text-gray-500">{emp.email}</p>
                                    </div>
                                </div>
                                {isSelected && <CheckCircle className="text-blue-600" size={24} />}
                                </div>
                            );
                            })
                        ) : (
                            <p className="col-span-2 text-center text-gray-400">No employees found in the system.</p>
                        )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: HOURS & CALCULATION */}
              {step === 2 && (
                <div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm text-gray-500 border-b">
                        <th className="pb-2">Employee</th>
                        <th className="pb-2 w-20">Hours</th>
                        <th className="pb-2 w-24">Basic (calc)</th>
                        <th className="pb-2 w-24 text-red-500">Advance (-)</th>
                        <th className="pb-2 w-24 text-red-500">Loan (-)</th>
                        <th className="pb-2 w-24 text-red-500">Deduct (-)</th>
                        <th className="pb-2 text-right">Net Pay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {calculationData.map((row) => (
                        <tr key={row.id}>
                          <td className="py-3">
                            <div className="font-medium">{row.name}</div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">Rate:</span>
                                <input
                                    type="number"
                                    value={row.hourlyRate}
                                    onChange={(e) => handleCalcChange(row.id, 'hourlyRate', e.target.value)}
                                    className={`w-20 border rounded p-1 text-sm outline-none focus:border-blue-500
                                        ${row.hourlyRate === 0 ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                    placeholder="0"
                                />
                            </div>
                          </td>
                          <td className="py-3">
                            <input
                              type="number"
                              value={row.hours}
                              onChange={(e) => handleCalcChange(row.id, 'hours', e.target.value)}
                              className="w-16 border rounded p-1 text-center outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="py-3 text-gray-600">
                            {(row.hours * row.hourlyRate).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <input
                              type="number"
                              value={row.advances}
                              onChange={(e) => handleCalcChange(row.id, 'advances', e.target.value)}
                              className="w-20 border rounded p-1 text-center text-red-600 bg-red-50 focus:bg-white"
                            />
                          </td>
                          <td className="py-3">
                            <input
                              type="number"
                              value={row.loans}
                              onChange={(e) => handleCalcChange(row.id, 'loans', e.target.value)}
                              className="w-20 border rounded p-1 text-center text-red-600 bg-red-50 focus:bg-white"
                            />
                          </td>
                          <td className="py-3">
                            <input
                              type="number"
                              value={row.deductions}
                              onChange={(e) => handleCalcChange(row.id, 'deductions', e.target.value)}
                              className="w-20 border rounded p-1 text-center text-red-600 bg-red-50 focus:bg-white"
                            />
                          </td>
                          <td className="py-3 text-right font-bold text-gray-800">
                            {row.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-6 flex justify-end">
                    <div className="bg-gray-100 p-4 rounded-lg text-right">
                      <p className="text-sm text-gray-500">Total Net Payable</p>
                      <p className="text-2xl font-bold text-blue-600">
                        Rs {calculationData.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
              {step === 2 ? (
                <button onClick={() => setStep(1)} className="text-gray-600 px-4 py-2 hover:bg-gray-200 rounded">
                  Back
                </button>
              ) : <div />}

              {step === 1 ? (
                <button
                  onClick={goToCalculation}
                  disabled={isCalculating}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2
                    ${isCalculating ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isCalculating ? (
                      <>Processing <Loader2 className="animate-spin" size={18}/></>
                  ) : (
                      <>Next Step <ChevronRight size={18} /></>
                  )}
                </button>
              ) : (
                <button
                  onClick={submitPayroll}
                  disabled={isCalculating || createStatus === 'loading'}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg text-white
                    ${isCalculating || createStatus === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isCalculating || createStatus === 'loading' ? 'Saving...' : <><Save size={18} /> Generate & Save</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PayrollComplete;
