import { useEffect, useState } from "react"
import API from "../../services/api"
import { useSelector } from "react-redux"
import { X, User, Mail, Lock, Phone } from "lucide-react"

export default function CreateUserModal({ onClose, refresh }) {

  const currentUser = useSelector(state => state.auth.user)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  })

  const [clients, setClients] = useState([])
  const [clientId, setClientId] = useState("")
  const [role, setRole] = useState("user")

  useEffect(() => {
    if (currentUser.role === "superadmin") {
      API.get("/clients").then(res => setClients(res.data))
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {

      let payload = { ...form }

      // for clientadmin role
      if (currentUser.role === "clientadmin") {
        payload.role = "user"
      }

      //for supradmin role
      if (currentUser.role === "superadmin") {

        if (!clientId) {
          return alert("Please select a company")
        }

        payload.role = role
        payload.clientId = clientId
      }

      // call api 
      if (payload.role === "clientadmin") {
        await API.post("/users/create-client-admin", payload)
      } else {
        await API.post("/users", payload)
      }

      refresh()
      onClose()

    } catch (err) {
      alert(err.response?.data?.message || "Error")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
              <User size={18} />
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Create User
            </h2>
          </div>

          <button onClick={onClose}>
            <X size={18} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">

          {/* INPUT FIELD */}
          <Input icon={User} name="name" placeholder="Name" onChange={handleChange} />
          <Input icon={Mail} name="email" placeholder="Email" onChange={handleChange} />
          <Input icon={Lock} name="password" placeholder="Password" onChange={handleChange} type="password" />
          <Input icon={Phone} name="phone" placeholder="Phone" onChange={handleChange} />

          {/* SUPER ADMIN */}
          {currentUser.role === "superadmin" && (
            <>
              <div>
                <label className="text-sm text-gray-600">Company</label>
                <select
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-xl bg-gray-50"
                >
                  <option value="">Select Company</option>
                  {clients.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Role</label>
                <select
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-xl bg-gray-50"
                >
                  <option value="user">User</option>
                  <option value="clientadmin">Client Admin</option>
                </select>
              </div>
            </>
          )}

          {/* CLIENT ADMIN INFO */}
          {currentUser.role === "clientadmin" && (
            <p className="text-sm text-gray-500">
              Creating user for your company
            </p>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={currentUser.role === "superadmin" && !clientId}
            className="px-6 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-50"
          >
            + Create
          </button>

        </div>

      </div>
    </div>
  )
}

// input component 

function Input({ icon: Icon, ...props }) {
  return (
    <div className="flex items-center gap-3 border rounded-xl px-3 py-3 bg-gray-50 focus-within:ring-2 focus-within:ring-purple-400">

      <Icon size={16} className="text-purple-500" />

      <input
        {...props}
        className="w-full bg-transparent outline-none text-sm"
      />
    </div>
  )
}