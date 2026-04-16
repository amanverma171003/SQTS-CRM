import { useEffect, useState } from "react"
import API from "../services/api"
import MainLayout from "../components/layout/MainLayout"
import CreateLeadModal from "../components/leads/CreateLeadModal"
import AssignLeadModal from "../components/leads/AssignLeadModal"
import LeadDetailsDrawer from "../components/leads/LeadDetailsDrawer"
import { useSelector } from "react-redux"

export default function Leads() {

  const [leads, setLeads] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [assignModal, setAssignModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)

  const currentUser = useSelector(state => state.auth.user)

  const fetchLeads = async () => {
    const res = await API.get("/leads")
    setLeads(res.data)
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const openAssign = (lead) => {
    setSelectedLead(lead)
    setAssignModal(true)
  }

  return (
    <MainLayout>

      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Leads
          </h1>

          {currentUser?.role !== "user" && (
            <button
              onClick={() => setOpenModal(true)}
              className="
                px-5 py-2 rounded-lg text-white font-medium
                bg-gradient-to-r from-purple-600 to-indigo-600
                hover:opacity-90 transition
              "
            >
              + New Lead
            </button>
          )}
        </div>

        {/* TABLE CARD */}
        <div className="
          rounded-2xl overflow-hidden
          bg-white/60 backdrop-blur-xl
          border border-white/30
          shadow-md
        ">

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              {/* HEAD */}
              <thead className="bg-gray-100/70 text-gray-600">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Phone</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Source</th>
                  {currentUser?.role !== "user" && (
                    <th className="text-left p-4">Assigned</th>
                  )}
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {leads.map(l => (
                  <tr
                    key={l._id}
                    onClick={() => setSelectedLead(l)}
                    className="
                      border-t hover:bg-white/40 cursor-pointer transition
                    "
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {l.name}
                    </td>

                    <td className="p-4 text-gray-600">
                      {l.phone}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="p-4">
                      <StatusBadge status={l.status} />
                    </td>

                    {/* SOURCE */}
                    <td className="p-4 text-gray-600 capitalize">
                      {l.source}
                    </td>

                    {/* ASSIGNED */}
                    {currentUser?.role !== "user" && (
                      <td className="p-4 text-gray-700">
                        {l.assignedTo?.name || "Unassigned"}
                      </td>
                    )}

                    {/* ACTION */}
                    <td className="p-4">
                      {currentUser?.role === "user" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLead(l)
                          }}
                          className="
                            px-3 py-1 rounded-lg text-sm
                            bg-purple-100 text-purple-600
                            hover:bg-purple-200
                          "
                        >
                          Follow-up
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openAssign(l)
                          }}
                          className="
                            px-3 py-1 rounded-lg text-sm
                            bg-gray-100 hover:bg-gray-200
                          "
                        >
                          {l.assignedTo ? "Reassign" : "Assign"}
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>

      {/* DRAWER */}
      {selectedLead && (
        <LeadDetailsDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

      {/* MODALS */}
      {openModal && (
        <CreateLeadModal
          onClose={() => setOpenModal(false)}
          refresh={fetchLeads}
        />
      )}

      {assignModal && currentUser?.role !== "user" && (
        <AssignLeadModal
          lead={selectedLead}
          onClose={() => setAssignModal(false)}
          refresh={fetchLeads}
        />
      )}

    </MainLayout>
  )
}

// status badgde 

function StatusBadge({ status }) {

  const styles = {
    "New Lead": "bg-purple-100 text-purple-600",
    "Follow-Up": "bg-yellow-100 text-yellow-600",
    "Interested": "bg-blue-100 text-blue-600",
    "Negotiation": "bg-indigo-100 text-indigo-600",
    "Closed": "bg-gray-200 text-gray-700"
  }

  return (
    <span className={`
      px-3 py-1 rounded-lg text-xs font-medium
      ${styles[status] || "bg-gray-100"}
    `}>
      {status}
    </span>
  )
}