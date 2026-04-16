import { useEffect, useState } from "react"
import API from "../services/api"
import { useSelector } from "react-redux"
import MainLayout from "../components/layout/MainLayout"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import {
  TrendingUp,
  Users,
  CheckCircle,
  BarChart3
} from "lucide-react"

export default function Analytics() {

  const [data, setData] = useState(null)
  const [range, setRange] = useState("7d")
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
  API.get(`/analytics?range=${range}`)
    .then(res => setData(res.data))
    .catch(err => console.log(err))
}, [range])


  if (!data) return <div className="p-6">Loading...</div>

  // Transform backend data
  const formattedLeads = data.leadsPerDay || []

    if (!user?.features?.advancedReports) {
        return (
            <MainLayout>
            <div className="p-6 text-gray-500">
                Analytics feature is disabled for your company.
            </div>
            </MainLayout>
        )
    }
  

  return (
    <MainLayout>

      <div className="p-6 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Analytics
          </h1>
          <p className="text-gray-500 text-sm">
            Insights of your business performance
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card
            title="Conversion Rate"
            value={`${data.conversionRate}%`}
            icon={<TrendingUp size={18} />}
            color="purple"
          />

          <Card
            title="Total Leads"
            value={data.totalLeads}
            icon={<Users size={18} />}
            color="blue"
          />

          <Card
            title="Closed Leads"
            value={data.closedLeads}
            icon={<CheckCircle size={18} />}
            color="green"
          />

        </div>

        {/* LEADS TREND */}
        <div className="
          bg-white/70 backdrop-blur-xl
          p-6 rounded-2xl shadow-lg border border-white/40
        ">

          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-purple-500" />
            <h2 className="text-lg font-semibold">
              Leads Trend
            </h2>
          </div>

          <div className="flex gap-3">

            <button onClick={() => setRange("7d")}
                className={`px-3 py-1 rounded-lg ${range==="7d" ? "bg-purple-500 text-white" : "bg-gray-200"}`}>
                7 Days
            </button>

            <button onClick={() => setRange("30d")}
                className={`px-3 py-1 rounded-lg ${range==="30d" ? "bg-purple-500 text-white" : "bg-gray-200"}`}>
                30 Days
            </button>

         </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formattedLeads}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                fill="url(#colorGradient)"
                strokeWidth={3}
              />

              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>

            </AreaChart>
          </ResponsiveContainer>

        </div>

        {/* DONUT CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <DonutChart
            title="Lead Status Distribution"
            data={data.statusDistribution}
          />

          <DonutChart
            title="Lead Source Distribution"
            data={data.sourceDistribution}
          />

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-lg font-semibold mb-4">
                Top Performing Sources
            </h2>

            <div className="space-y-3">

                {data.topSources.map((src, i) => (
                <div key={i} className="flex justify-between items-center">

                    <span className="capitalize text-gray-700">
                    {src._id}
                    </span>

                    <div className="flex gap-4 text-sm">

                    <span>Total: {src.total}</span>
                    <span className="text-green-600">
                        {src.conversionRate.toFixed(1)}%
                    </span>

                    </div>

                </div>
                ))}

            </div>

            </div>

      </div>

    </MainLayout>
  )
}


// kpi cards

function Card({ title, value, icon, color }) {

  const colorMap = {
    purple: "border-t-purple-500 bg-purple-50",
    blue: "border-t-blue-500 bg-blue-50",
    green: "border-t-green-500 bg-green-50"
  }

  return (
    <div className={`
      p-5 rounded-2xl border-t-4 ${colorMap[color]}
      shadow-md hover:shadow-lg transition
    `}>

      <div className="flex items-center justify-between mb-3">

        <div className="flex items-center gap-2 text-gray-600 font-medium">
          {icon}
          {title}
        </div>

        <div className="p-2 rounded-full bg-white shadow">
          {icon}
        </div>

      </div>

      <h2 className="text-3xl font-bold text-gray-800">
        {value}
      </h2>

    </div>
  )
}

// doughnut chart

function DonutChart({ title, data }) {

  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"]

  const formatted = data.map(item => ({
    name: item._id,
    value: item.value
  }))

  return (
    <div className="
      bg-white/70 backdrop-blur-xl
      p-6 rounded-2xl shadow-lg border border-white/40
    ">

      <h2 className="text-lg font-semibold mb-4">
        {title}
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
                data={formatted}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                label
            >
                {formatted.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>

            <Legend />
            </PieChart>
      </ResponsiveContainer>

    </div>
  )
}