import { useEffect, useState } from "react"
import API from "../services/api"
import MainLayout from "../components/layout/MainLayout"
import LeadDetailsDrawer from "../components/leads/LeadDetailsDrawer"
import { useSelector } from "react-redux"
import { Clock } from "lucide-react"

const stages = ["New Lead", "Follow-Up", "Interested", "Negotiation", "Closed"]

const stageStyles = {
  "New Lead": {
    bg: "bg-purple-50",
    border: "border-purple-300",
    badge: "bg-purple-100 text-purple-600",
    chip: "bg-purple-100 text-purple-600"
  },
  "Follow-Up": {
    bg: "bg-blue-50",
    border: "border-blue-300",
    badge: "bg-blue-100 text-blue-600",
    chip: "bg-blue-100 text-blue-600"
  },
  "Interested": {
    bg: "bg-green-50",
    border: "border-green-300",
    badge: "bg-green-100 text-green-600",
    chip: "bg-green-100 text-green-600"
  },
  "Negotiation": {
    bg: "bg-orange-50",
    border: "border-orange-300",
    badge: "bg-orange-100 text-orange-600",
    chip: "bg-orange-100 text-orange-600"
  },
  "Closed": {
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    badge: "bg-emerald-100 text-emerald-600",
    chip: "bg-emerald-100 text-emerald-600"
  }
}

export default function Pipeline() {

  const [leads, setLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)

  const currentUser = useSelector(state => state.auth.user)
  const isAdmin = currentUser?.role === "clientadmin"

  const fetchLeads = async () => {
    const res = await API.get("/leads")
    setLeads(res.data)
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const canMoveToStage = (targetStage, currentStatus) => {
    if (targetStage === currentStatus) return false
    if (isAdmin) return true

    if (currentStatus === "Closed" && targetStage !== "Closed") {
      return false
    }

    return true
  }

  const moveLead = async (e, leadId, newStatus, currentStatus) => {
    e.stopPropagation()

    if (!isAdmin && currentStatus === "Closed" && newStatus !== "Closed") {
      alert("You cannot reopen a closed lead")
      return
    }

    try {
      await API.patch(`/leads/${leadId}/status`, { status: newStatus })
      fetchLeads()
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status")
    }
  }

  return (
    <MainLayout>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Sales Pipeline</h1>
          <p className="text-sm text-gray-500">
            Drag and manage your leads across stages
          </p>
        </div>

        <button className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600">
          + Add Lead
        </button>
      </div>

      {/* PIPELINE */}
      <div className="flex gap-5 overflow-x-auto pb-4 w-full pr-6 scroll-smooth">

        {stages.map(stage => {

          const style = stageStyles[stage]
          const stageLeads = leads.filter(l => l.status === stage)

          return (
            <div
              key={stage}
              className={`
                min-w-[260px] flex-shrink-0
                rounded-2xl p-4 shadow-sm
                ${style.bg} border-t-4 ${style.border}
              `}
            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">
                  {stage}
                </h3>

                <span className={`text-xs px-2 py-1 rounded-full ${style.badge}`}>
                  {stageLeads.length}
                </span>
              </div>

              {/* EMPTY */}
              {stageLeads.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-10">
                  No leads
                </div>
              )}

              {/* CARDS */}
              <div className="space-y-3">
                {stageLeads.map(l => (

                  <div
                    key={l._id}
                    onClick={() => setSelectedLead(l)}
                    className="
                      bg-white rounded-xl p-3
                      shadow-sm hover:shadow-md
                      border border-gray-100
                      cursor-pointer transition
                    "
                  >

                    <p className="font-medium text-gray-800">
                      {l.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {l.phone}
                    </p>

                    {/* STATUS */}
                    <div className="mt-2 flex justify-between items-center">

                      <span className={`text-xs px-2 py-1 rounded-full ${style.chip}`}>
                        {l.status}
                      </span>

                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} />
                        {new Date(l.createdAt).toLocaleDateString()}
                      </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-1 mt-3">

                      {stages
                        .filter(s => canMoveToStage(s, l.status))
                        .map(s => (
                          <button
                            key={s}
                            onClick={(e) => moveLead(e, l._id, s, l.status)}
                            className="
                              text-[10px] px-2 py-1 rounded
                              bg-gray-100 hover:bg-purple-100
                            "
                          >
                            → {s}
                          </button>
                        ))}

                      {l.status === "Closed" && !isAdmin && (
                        <span className="text-[10px] text-gray-400">
                          🔒 Admin only
                        </span>
                      )}

                    </div>

                  </div>

                ))}
              </div>

            </div>
          )
        })}

      </div>

      {/* DRAWER */}
      {selectedLead && (
        <LeadDetailsDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

    </MainLayout>
  )
}