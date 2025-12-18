// import { Loader2, Plus } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   clearLoanMessages,
//   fetchLoanRequests,
//   requestLoan,
// } from "../../../features/loan/loanSlice";

// const MyLoans = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((s) => s.auth);
//   const { items, status, error, successMessage } = useSelector((s) => s.loan);

//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({ amount: "", reason: "" });

//   useEffect(() => {
//     if (user?.id) dispatch(fetchLoanRequests(user.id));
//   }, [dispatch, user?.id]);

//   useEffect(() => {
//     if (successMessage && user?.id) {
//       setOpen(false);
//       dispatch(fetchLoanRequests(user.id));
//       setTimeout(() => dispatch(clearLoanMessages()), 1200);
//     }
//   }, [successMessage, dispatch, user?.id]);

//   const submit = (e) => {
//     e.preventDefault();
//     dispatch(
//       requestLoan({
//         employee_id: user.id,
//         amount: Number(form.amount),
//         reason: form.reason,
//       })
//     );
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Loan</h1>
//           <p className="text-sm text-slate-500">Request loan & view history</p>
//         </div>
//         <button
//           onClick={() => {
//             dispatch(clearLoanMessages());
//             setOpen(true);
//           }}
//           className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
//         >
//           <Plus size={18} /> Request Loan
//         </button>
//       </div>

//       {(error || successMessage) && (
//         <div
//           className={`p-3 rounded-xl text-sm border ${
//             error
//               ? "bg-rose-50 border-rose-100 text-rose-700"
//               : "bg-emerald-50 border-emerald-100 text-emerald-700"
//           }`}
//         >
//           {error || successMessage}
//         </div>
//       )}

//       <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
//         <div className="p-4 border-b bg-slate-50 font-bold text-slate-800">
//           Requests ({items?.length || 0})
//         </div>

//         {status === "loading" ? (
//           <div className="p-10 flex justify-center">
//             <Loader2 className="animate-spin text-indigo-600" />
//           </div>
//         ) : (
//           <div className="divide-y">
//             {(items || []).map((r) => (
//               <div key={r.id} className="p-4 flex items-center justify-between">
//                 <div>
//                   <div className="font-semibold text-slate-800">
//                     PKR {Number(r.amount || 0).toLocaleString()}
//                   </div>
//                   <div className="text-xs text-slate-500">{r.reason}</div>
//                 </div>
//                 <span className="px-3 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-100">
//                   {r.status || "pending"}
//                 </span>
//               </div>
//             ))}
//             {(!items || items.length === 0) && (
//               <div className="p-10 text-center text-slate-400">
//                 No loan requests yet.
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {open && (
//         <div
//           className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
//           onClick={() => setOpen(false)}
//         >
//           <div
//             className="bg-white w-full max-w-md rounded-2xl border shadow-xl overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-5 border-b bg-slate-50">
//               <h3 className="font-bold text-slate-800">Request Loan</h3>
//               <p className="text-xs text-slate-500">Fill details and submit</p>
//             </div>

//             <form onSubmit={submit} className="p-5 space-y-4">
//               <div>
//                 <label className="text-xs font-bold text-slate-400 uppercase">
//                   Amount
//                 </label>
//                 <input
//                   className="w-full mt-1 p-3 border rounded-xl"
//                   type="number"
//                   required
//                   value={form.amount}
//                   onChange={(e) => setForm({ ...form, amount: e.target.value })}
//                   placeholder="15000"
//                 />
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-slate-400 uppercase">
//                   Reason
//                 </label>
//                 <textarea
//                   className="w-full mt-1 p-3 border rounded-xl"
//                   rows="3"
//                   value={form.reason}
//                   onChange={(e) => setForm({ ...form, reason: e.target.value })}
//                   placeholder="personal..."
//                   required
//                 />
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setOpen(false)}
//                   className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={status === "loading"}
//                   className="flex-[2] py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
//                 >
//                   {status === "loading" ? "Submitting..." : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyLoans;

// --------------------------------------------------------------------------------

import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearLoanMessages,
  fetchLoanRequests,
  requestLoan,
} from "../../../features/loan/loanSlice";

const renderError = (err) => {
  if (!err) return null;
  if (typeof err === "string") return err;

  if (typeof err === "object") {
    return Object.entries(err)
      .map(
        ([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`
      )
      .join(" | ");
  }

  return String(err);
};

const MyLoans = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items, status, error, successMessage } = useSelector((s) => s.loan);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: "", reason: "" });

  // ✅ backend ko employee_id chahiye (user.id nahi)
  const employeeId = Number(user?.employee_id);

  useEffect(() => {
    if (employeeId) dispatch(fetchLoanRequests(employeeId));
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (successMessage && employeeId) {
      setOpen(false);
      setForm({ amount: "", reason: "" });
      dispatch(fetchLoanRequests(employeeId));
      setTimeout(() => dispatch(clearLoanMessages()), 1200);
    }
  }, [successMessage, dispatch, employeeId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      requestLoan({
        employee_id: employeeId,
        amount: Number(form.amount),
        reason: form.reason,
      })
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loan</h1>
          <p className="text-sm text-slate-500">Request loan & view history</p>
        </div>

        <button
          onClick={() => {
            dispatch(clearLoanMessages());
            setOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
        >
          <Plus size={18} /> Request Loan
        </button>
      </div>

      {error && (
        <div className="text-red-600 bg-red-50 border p-2 rounded">
          {renderError(error)}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 font-bold text-slate-800">
          Requests ({items?.length || 0})
        </div>

        {status === "loading" ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="divide-y">
            {(items || []).map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">
                    PKR {Number(r.amount || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">{r.reason}</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-100">
                  {r.status || "pending"}
                </span>
              </div>
            ))}

            {(!items || items.length === 0) && (
              <div className="p-10 text-center text-slate-400">
                No loan requests yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl border shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b bg-slate-50">
              <h3 className="font-bold text-slate-800">Request Loan</h3>
              <p className="text-xs text-slate-500">Fill details and submit</p>
            </div>

            {/* ✅ form submit updated */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Amount
                </label>
                <input
                  className="w-full mt-1 p-3 border rounded-xl"
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  placeholder="15000"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Reason
                </label>
                <textarea
                  className="w-full mt-1 p-3 border rounded-xl"
                  rows="3"
                  value={form.reason}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="personal..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-[2] py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {status === "loading" ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLoans;
