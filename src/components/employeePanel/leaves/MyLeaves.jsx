import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearLeaveMessages,
  fetchLeaveRequests,
  requestLeave,
} from "../../../features/leave/leaveSlice";

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

const MyLeaves = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items, status, error, successMessage } = useSelector((s) => s.leave);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ from_date: "", to_date: "", reason: "" });

  // ✅ IMPORTANT: backend ko employee_id chahiye (not user.id)
  const employeeId = Number(user?.employee_id);

  useEffect(() => {
    if (employeeId) dispatch(fetchLeaveRequests(employeeId));
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (successMessage && employeeId) {
      setOpen(false);
      setForm({ from_date: "", to_date: "", reason: "" });
      dispatch(fetchLeaveRequests(employeeId));
      setTimeout(() => dispatch(clearLeaveMessages()), 1200);
    }
  }, [successMessage, dispatch, employeeId]);

  // ✅ SINGLE submit handler (duplicate remove)
  const handleSubmit = (e) => {
    e.preventDefault();

    const employeeId = Number(user?.employee_id); // ✅ yahi correct hai

    dispatch(
      requestLeave({
        employee_id: employeeId,
        from_date: form.from_date,
        to_date: form.to_date,
        reason: form.reason,
      })
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave</h1>
          <p className="text-sm text-slate-500">Request leave & view history</p>
        </div>

        <button
          onClick={() => {
            dispatch(clearLeaveMessages());
            setOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
        >
          <Plus size={18} /> Request Leave
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
                    {r.from_date} → {r.to_date}
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
                No leave requests yet.
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
              <h3 className="font-bold text-slate-800">Request Leave</h3>
              <p className="text-xs text-slate-500">Fill details and submit</p>
            </div>

            {/* ✅ form onSubmit updated */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">
                    From
                  </label>
                  <input
                    className="w-full mt-1 p-3 border rounded-xl"
                    type="date"
                    required
                    value={form.from_date}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        from_date: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">
                    To
                  </label>
                  <input
                    className="w-full mt-1 p-3 border rounded-xl"
                    type="date"
                    required
                    value={form.to_date}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, to_date: e.target.value }))
                    }
                  />
                </div>
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

export default MyLeaves;
