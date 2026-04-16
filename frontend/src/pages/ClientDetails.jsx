import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../services/api"
import MainLayout from "../components/layout/MainLayout"
import ManageUserModal from "../components/users/ManageUserModal"
import { FaUsers, FaUserShield, FaEdit, FaBuilding } from "react-icons/fa"

export default function ClientDetails() {
  const [whatsappEnabled, setWhatsappEnabled] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const { id } = useParams()

  const [client, setClient] = useState(null)
  const [admins, setAdmins] = useState([])
  const [users, setUsers] = useState([])

  const [isActive, setIsActive] = useState(false)
  const [plan, setPlan] = useState("")

  const [selectedUser, setSelectedUser] = useState(null) // ✅ NEW

  const fetchClient = async () => {
    const res = await API.get(`/clients/${id}`)

    setClient(res.data.client)
    setAdmins(res.data.clientAdmins)
    setUsers(res.data.users)
    setWhatsappEnabled(res.data.client.features?.whatsapp || false)
    setAnalyticsEnabled(res.data.client.features?.advancedReports || false)
    setIsActive(res.data.client.isActive)
    setPlan(res.data.client.planType)
  }

  useEffect(() => {
    fetchClient()
  }, [id])

  if (!client) return <div className="p-6">Loading...</div>

  const normalUsers = users.filter(u => u.role === "user")

  const updateClient = async (updates) => {
    try {
      const res = await API.patch(`/clients/${id}`, updates)
      setClient(res.data)
    } catch (err) {
      alert(err.response?.data?.message || "Error")
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="
          p-6 rounded-2xl
          bg-gradient-to-r from-purple-200 via-indigo-100 to-purple-100
          shadow-md flex items-center justify-between
        ">

          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-xl shadow">
              <FaBuilding className="text-purple-600 text-xl" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {client.companyName}
              </h2>

              <p className="text-sm text-gray-500">
                {client.industryType}
              </p>
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-gray-500">Plan</p>
              <p className="font-semibold">{client.planType}</p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium
                ${client.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"}`}>
                {client.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          
          <div className="card">
            <SectionHeader icon={<FaUserShield />} title="Client Admins" />

            {admins.length === 0 ? (
              <Empty />
            ) : (
              admins.map(a => (
                <UserCard
                  key={a._id}
                  user={a}
                  onClick={() => setSelectedUser(a)} 
                />
              ))
            )}
          </div>

          {/* ===== USERS ===== */}
          <div className="card">
            <SectionHeader icon={<FaUsers />} title="Users" />

            {normalUsers.length === 0 ? (
              <Empty />
            ) : (
              normalUsers.map(u => (
                <UserCard
                  key={u._id}
                  user={u}
                  onClick={() => setSelectedUser(u)} 
                />
              ))
            )}
          </div>

          {/*ADMIN CONTROLS */}
          <div className="card">
            <SectionHeader icon={<FaEdit />} title="Admin Controls" />

            {/* STATUS */}
            <div className="control-row">
              <span>Active</span>

              <Toggle
                value={isActive}
                onChange={(val) => {
                  setIsActive(val)
                  updateClient({ isActive: val })
                }}
              />
            </div>

            {/* PLAN */}
            <div className="control-row">
              <span>Plan</span>

              <select
                value={plan}
                onChange={(e) => {
                  const value = e.target.value
                  setPlan(value)
                  updateClient({ planType: value })
                }}
                className="input"
              >
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            {/* WHATSAPP */}
            <div className="control-row">
              <span className="flex items-center gap-2">
                WhatsApp
              </span>

              <Toggle
                value={whatsappEnabled}
                onChange={(val) => {
                  if (plan !== "enterprise") return
                  setWhatsappEnabled(val)
                  updateClient({
                    features: {
                      ...client.features,
                      whatsapp: val
                    }
                  })
                }}
              />
            </div>

            {/* ADVANCED ANALYTICS */}
            <div className="control-row">
              <span className="flex items-center gap-2">
                Advanced Analytics
              </span>

              <Toggle
                value={analyticsEnabled}
                onChange={(val) => {
                  
                  if (plan === "basic") {
                    alert("Upgrade plan to enable analytics")
                    return
                  }

                  setAnalyticsEnabled(val)

                  updateClient({
                    features: {
                      ...client.features,
                      advancedReports: val
                    }
                  })
                }}
              />
            </div>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {selectedUser && (
        <ManageUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          refresh={fetchClient}
        />
      )}

    </MainLayout>
  )
}


// components

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
      <span className="text-purple-600">{icon}</span>
      {title}
    </div>
  )
}

function UserCard({ user, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        p-3 mb-3 rounded-xl border
        hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200 cursor-pointer
      "
    >
      <p className="font-medium text-gray-800">{user.name}</p>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
  )
}

function Empty() {
  return (
    <p className="text-gray-400 text-sm">No data available</p>
  )
}

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




