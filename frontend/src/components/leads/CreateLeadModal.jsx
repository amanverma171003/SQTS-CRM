import { useState } from "react"
import API from "../../services/api"
import { X, User, Phone, Mail, Globe } from "lucide-react"

export default function CreateLeadModal({ onClose, refresh }) {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.phone) {
        return alert("Name and Phone are required")
      }

      setLoading(true)

      await API.post("/leads", form)

      refresh()
      onClose()

    } catch (err) {
      alert(err.response?.data?.message || "Error")
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
        bg-white rounded-2xl shadow-xl
        overflow-hidden animate-fadeIn
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
              <User size={18} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Create Lead
              </h2>
              <p className="text-xs text-gray-500">
                Add a new lead to your pipeline
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-black" size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          <Input
            icon={User}
            name="name"
            placeholder="Enter name"
            onChange={handleChange}
          />

          <Input
            icon={Phone}
            name="phone"
            placeholder="Enter phone"
            onChange={handleChange}
          />

          <Input
            icon={Mail}
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
          />

          <Input
            icon={Globe}
            name="source"
            placeholder="Lead source (facebook, google...)"
            onChange={handleChange}
          />

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
            onClick={handleSubmit}
            disabled={loading}
            className="
              px-5 py-2 rounded-lg text-white font-medium
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:opacity-90 disabled:opacity-50
            "
          >
            {loading ? "Creating..." : "+ Create"}
          </button>

        </div>

      </div>
    </div>
  )
}

// input component

function Input({ icon: Icon, ...props }) {
  return (
    <div className="
      flex items-center gap-3
      border rounded-xl px-3 py-2
      focus-within:ring-2 focus-within:ring-purple-400
    ">
      <Icon size={16} className="text-gray-400" />

      <input
        {...props}
        className="w-full outline-none text-sm"
      />
    </div>
  )
}