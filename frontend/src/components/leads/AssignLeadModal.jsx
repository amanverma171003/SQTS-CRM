import { useEffect, useState } from "react"
import API from "../../services/api"
import { X, UserCheck } from "lucide-react"

export default function AssignLeadModal({ lead, onClose, refresh }) {

  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    API.get("/users")
      .then(res => setUsers(res.data))
  }, [])

  const handleAssign = async () => {
    try {
      if (!selectedUser) {
        return alert("Please select a user")
      }

      setLoading(true)

      await API.patch(`/leads/${lead._id}/assign`, {
        userId: selectedUser
      })

      refresh()
      onClose()

    } catch (err) {
      alert(err.response?.data?.message || "Error assigning")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="
      fixed inset-0 bg-black/40 backdrop-blur-sm
      flex items-center justify-center z-50
    ">

      <div className="
        w-full max-w-md mx-4
        bg-white rounded-2xl shadow-xl overflow-hidden
      ">

        {/* HEADER */}
        <div className="
          flex items-center justify-between
          px-6 py-4 border-b
          bg-gradient-to-r from-purple-500/10 to-indigo-500/10
        ">
          <div className="flex items-center gap-3">
            <div className="
              w-10 h-10 rounded-full
              bg-gradient-to-r from-purple-500 to-indigo-500
              flex items-center justify-center text-white
            ">
              <UserCheck size={18} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {lead.assignedTo ? "Reassign Lead" : "Assign Lead"}
              </h2>
              <p className="text-xs text-gray-500">
                {lead.name} • {lead.phone}
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X size={18} className="text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          <label className="text-sm font-medium text-gray-600">
            Select User
          </label>

          <select
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Select User</option>

            {users
              .filter(u => u.role === "user") 
              .map(u => (
                <option
                  key={u._id}
                  value={u._id}
                  disabled={!u.isActive}
                >
                  {u.name} {!u.isActive ? "(Inactive)" : ""}
                </option>
            ))}
          </select>

          {/* INFO */}
          {lead.assignedTo && (
            <p className="text-xs text-gray-500">
              Currently assigned to <b>{lead.assignedTo.name}</b>
            </p>
          )}

        </div>

        {/* FOOTER */}
        <div className="
          flex justify-end gap-3
          px-6 py-4 border-t bg-gray-50
        ">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={loading}
            className="
              px-5 py-2 rounded-lg text-white font-medium
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:opacity-90 disabled:opacity-50
            "
          >
            {loading
              ? "Assigning..."
              : lead.assignedTo
              ? "Reassign"
              : "Assign"}
          </button>

        </div>

      </div>
    </div>
  )
}