import { useEffect, useState } from "react"
import API from "../services/api"
import MainLayout from "../components/layout/MainLayout"
import { useNavigate } from "react-router-dom"
import CreateClientModal from "../components/clients/CreateClientModal"

export default function Clients() {

  const [clients, setClients] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const navigate = useNavigate()

  const fetchClients = async () => {
    const res = await API.get("/clients")
    setClients(res.data)
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <MainLayout>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Clients</h2>

        <button
          onClick={() => setOpenModal(true)}
          className="
            px-4 py-2 rounded-xl text-white
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:scale-105 transition
          "
        >
          + Add Client
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Industry</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {clients.map(c => (
              <tr
                key={c._id}
                onClick={() => navigate(`/clients/${c._id}`)}
                className="cursor-pointer hover:bg-purple-50 transition"
              >
                <td className="p-3">{c.companyName}</td>
                <td className="p-3">{c.industryType}</td>
                <td className="p-3">{c.planType}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-lg text-xs ${
                    c.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {openModal && (
        <CreateClientModal
          onClose={() => setOpenModal(false)}
          refresh={fetchClients}
        />
      )}

    </MainLayout>
  )
}