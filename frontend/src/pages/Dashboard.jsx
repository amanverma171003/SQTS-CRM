import { useEffect, useState } from "react"
import API from "../services/api"
import MainLayout from "../components/layout/MainLayout"
import { useSelector } from "react-redux"
import {
  Users,
  UserCheck,
  User,
  Lightbulb
} from "lucide-react"

export default function Dashboard() {

  const user = useSelector(state => state.auth.user)
  const [data, setData] = useState({})
  const [activities, setActivities] = useState([])

  useEffect(() => {
    API.get("/dashboard")
      .then(res => setData(res.data))

    API.get("/activities/feed")
      .then(res => setActivities(res.data))
      .catch(err => console.log("ACTIVITY ERROR:", err))
  }, [])

  return (
    <MainLayout>

      <div className="p-6 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Overview of your performance
          </p>
        </div>

        {/* ROLE BASED CARDS */}

        {user?.role === "superadmin" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card title="Total Clients" value={data.totalClients} icon={<Users />} color="bg-pink-100 text-pink-600" />
            <Card title="Active Clients" value={data.activeClients} icon={<UserCheck />} color="bg-green-100 text-green-600" />
            <Card title="Total Users" value={data.totalUsers} icon={<User />} color="bg-indigo-100 text-indigo-600" />
            <Card title="Total Leads" value={data.totalLeads} icon={<Lightbulb />} color="bg-yellow-100 text-yellow-600" />
          </div>
        )}

        {user?.role === "user" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Total Leads" value={data.totalLeads} icon={<Lightbulb />} color="bg-purple-100 text-purple-600" />
            <Card title="Completed" value={data.completed} icon={<UserCheck />} color="bg-green-100 text-green-600" />
            <Card title="Remaining" value={data.remaining} icon={<User />} color="bg-orange-100 text-orange-600" />
            <Card title="Follow-ups Today" value={data.followups} icon={<Users />} color="bg-indigo-100 text-indigo-600" />
          </div>
        )}

        {user?.role === "clientadmin" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Total Leads" value={data.totalLeads} icon={<Lightbulb />} color="bg-purple-100 text-purple-600" />
            <Card title="Leads Today" value={data.leadsToday} icon={<Users />} color="bg-blue-100 text-blue-600" />
            <Card title="Follow-ups Today" value={data.followupsToday} icon={<UserCheck />} color="bg-green-100 text-green-600" />
          </div>
        )}

        {/* COMMON ACTIVITY for all roles */}

        <div>

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>

          <div className="
            bg-white/60 backdrop-blur-xl
            rounded-2xl border border-white/30
            shadow-md overflow-hidden
          ">

            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left">Action</th>
                    <th className="px-4 py-3 text-left">Lead</th>
                    <th className="px-4 py-3 text-left">Details</th>
                    <th className="px-4 py-3 text-left">By</th>
                    <th className="px-4 py-3 text-left">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-gray-400">
                        No recent activity
                      </td>
                    </tr>
                  ) : (
                    activities.map(a => (
                      <tr key={a._id} className="border-t hover:bg-gray-50">

                        <td className="px-4 py-3">
                          <ActivityBadge type={a.type} />
                        </td>

                        <td className="px-4 py-3 font-medium">
                          {a.leadId?.name || "-"}
                        </td>

                        <td className="px-4 py-3">
                          {a.message || "-"}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {a.createdBy?.name || "-"}
                        </td>

                        <td className="px-4 py-3 text-xs text-gray-400">
                          {new Date(a.createdAt).toLocaleString()}
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  )
}

// card
function Card({ title, value, icon, color }) {
  return (
    <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/30 shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-2">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800">{value ?? 0}</h2>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    </div>
  )
}

// activity badges 
function ActivityBadge({ type }) {
  const styles = {
    LEAD_CREATED: "bg-blue-100 text-blue-600",
    LEAD_ASSIGNED: "bg-green-100 text-green-600",
    STATUS_CHANGED: "bg-purple-100 text-purple-600",
    FOLLOWUP_ADDED: "bg-indigo-100 text-indigo-600",
    LEAD_CLOSED: "bg-gray-200 text-gray-700",
    USER_CREATED: "bg-pink-100 text-pink-600",
    CLIENT_CREATED: "bg-yellow-100 text-yellow-600",
    CLIENTADMIN_CREATED: "bg-orange-100 text-orange-600"
  }

  const labels = {
    LEAD_CREATED: "Lead Created",
    LEAD_ASSIGNED: "Assigned",
    STATUS_CHANGED: "Stage Changed",
    FOLLOWUP_ADDED: "Follow-up",
    LEAD_CLOSED: "Closed",
    USER_CREATED: "User Created",
    CLIENT_CREATED: "Client Created",
    CLIENTADMIN_CREATED: "Admin Created"
  }

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[type] || "bg-gray-100 text-gray-600"}`}>
      {labels[type] || "Activity"}
    </span>
  )
}