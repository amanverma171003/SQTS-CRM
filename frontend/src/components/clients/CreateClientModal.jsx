import { useState } from "react"
import API from "../../services/api"
import { X, Building2, Briefcase, Crown } from "lucide-react"
import { useEffect } from "react"


// toggle button
function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition
        ${value ? "bg-purple-600" : "bg-gray-300"}
      `}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full shadow transform transition
          ${value ? "translate-x-7" : ""}
        `}
      />
    </div>
  )
}

export default function CreateClientModal({ onClose, refresh }) {

  const [form, setForm] = useState({
    companyName: "",
    industryType: "real_estate",
    planType: "basic",
    features: {
      whatsapp: false,
      advancedReports: false,
      exportData: false
    }
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleFeature = (key) => {
    setForm({
      ...form,
      features: {
        ...form.features,
        [key]: !form.features[key]
      }
    })
  }

  const handleSubmit = async () => {
    try {
      if (!form.companyName.trim()) {
        return alert("Company name is required")
      }

      setLoading(true)

      await API.post("/clients", form)

      refresh()
      onClose()

    } catch (err) {
      alert(err.response?.data?.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Building2 className="text-purple-600" size={18} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Create Client</h2>
              <p className="text-xs text-gray-500">
                Add a new client and configure their plan & features
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X size={18} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-5">

          {/* COMPANY */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Company Name
            </label>

            <div className="flex items-center gap-2 mt-1 border rounded-xl px-3 py-3 bg-gray-50">
              <Building2 size={16} className="text-purple-500" />
              <input
                name="companyName"
                placeholder="Enter company name"
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* INDUSTRY */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Industry
            </label>

            <div className="flex items-center gap-2 mt-1 border rounded-xl px-3 py-3 bg-gray-50">
              <Briefcase size={16} className="text-purple-500" />
              <select
                name="industryType"
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm"
              >
                <option value="real_estate">Real Estate</option>
                <option value="coaching">Coaching</option>
                <option value="showroom">Showroom</option>
              </select>
            </div>
          </div>

          {/* PLAN */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Plan
            </label>

            <div className="flex items-center gap-2 mt-1 border rounded-xl px-3 py-3 bg-gray-50">
              <Crown size={16} className="text-purple-500" />
              <select
                name="planType"
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm"
              >
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          {/* FEATURES */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Features
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Enable or disable features for this client
            </p>

            <div className="space-y-3">

              <FeatureRow
                title="WhatsApp Integration"
                desc="Enable WhatsApp messaging and notifications"
                value={form.features.whatsapp}
                onChange={() => toggleFeature("whatsapp")}
              />

              <FeatureRow
                title="Advanced Reports"
                desc="Access detailed analytics and reports"
                value={form.features.advancedReports}
                onChange={() => toggleFeature("advancedReports")}
              />

              <FeatureRow
                title="Export Data"
                desc="Allow client to export their data"
                value={form.features.exportData}
                onChange={() => toggleFeature("exportData")}
              />

            </div>
          </div>

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
            disabled={loading}
            className="
              px-6 py-2 rounded-lg text-white font-medium
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:opacity-90 transition disabled:opacity-50
            "
          >
            {loading ? "Creating..." : "+ Create Client"}
          </button>

        </div>

      </div>
    </div>
  )
}

// features row 

function FeatureRow({ title, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border">

      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>

      <Toggle value={value} onChange={onChange} />
    </div>
  )
}