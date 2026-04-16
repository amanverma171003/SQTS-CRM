import API from "../../services/api"
import { useEffect, useState } from "react"
import { X, Mail, Phone, Trash2 } from "lucide-react"

export default function ManageUserModal({ user, onClose, refresh }) {

  const [leads, setLeads] = useState([])
  const [confirm, setConfirm] = useState(false)

  const isClientAdmin = user.role === "clientadmin" 

  useEffect(() => {
    if (isClientAdmin) return

    const fetchLeads = async () => {
      try {
        const res = await API.get(`/users/${user._id}/leads`)
        setLeads(res.data)
      } catch (err) {
        console.error("Lead fetch error:", err)
      }
    }

    fetchLeads()
  }, [user])

  const deactivateUser = async () => {
    try {
      const res = await API.patch(`/users/${user._id}/deactivate`)
      alert(res.data.message)
      refresh()
      onClose()
    } catch (err) {
      alert(err.response?.data?.message || "Error")
    }
  }

  const reactivateUser = async () => {
    try {
      await API.patch(`/users/${user._id}/reactivate`)
      refresh()
      onClose()
    } catch (err) {
      alert(err.response?.data?.message || "Error")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="
        w-full max-w-md rounded-2xl
        bg-white shadow-2xl overflow-hidden
      ">

        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50">

          <div className="flex items-center gap-3">
            <div className="
              w-10 h-10 rounded-full
              bg-gradient-to-r from-purple-500 to-indigo-500
              flex items-center justify-center text-white font-bold
            ">
              {user.name?.[0]}
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              {user.name}
            </h2>
          </div>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">

          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} />
            {user.email}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} />
            {user.phone}
          </div>

          {/* ONLY FOR NORMAL USERS */}
          {!isClientAdmin && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">
                Assigned Leads: {leads.length}
              </p>

              {leads.length === 0 ? (
                <p className="text-gray-400 text-xs mt-1">
                  No assigned leads
                </p>
              ) : (
                <div className="mt-2 max-h-24 overflow-auto text-xs space-y-1">
                  {leads.map(l => (
                    <div key={l._id} className="bg-gray-100 px-2 py-1 rounded">
                      {l.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WARNING ONLY FOR NORMAL USERS */}
          {!isClientAdmin && confirm && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
              ⚠ This user has <b>{leads.length}</b> leads.  
              They will be <b>unassigned</b>.
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">

          {user.isActive ? (
            <>
              {!confirm ? (
                <button
                  onClick={() => setConfirm(true)}
                  className="
                    flex items-center gap-2
                    px-4 py-2 rounded-lg text-white
                    bg-gradient-to-r from-red-500 to-pink-500
                  "
                >
                  <Trash2 size={16} />
                  Deactivate
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setConfirm(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={deactivateUser}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Confirm
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              onClick={reactivateUser}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Reactivate
            </button>
          )}

          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Close
          </button>

        </div>

      </div>
    </div>
  )
}