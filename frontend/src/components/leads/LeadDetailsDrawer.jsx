import { useEffect, useState } from "react"
import API from "../../services/api"
import { X, Phone, User, Calendar, MessageCircle } from "lucide-react"
import { useSelector } from "react-redux"

export default function LeadDetailsDrawer({ lead, onClose }) {

  const [activities, setActivities] = useState([])
  const [note, setNote] = useState("")
  const [date, setDate] = useState("")

  const user = useSelector(state => state.auth.user)
  const canUseWhatsApp =
    user?.planType === "enterprise" &&
    user?.features?.whatsapp === true

  const isClosed = lead?.status === "Closed"

  const fetchActivities = async () => {
    if (!lead?._id) return
    const res = await API.get(`/followups/${lead._id}`)
    setActivities(res.data)
  }

  useEffect(() => {
    if (!lead?._id) return
    fetchActivities()
  }, [lead])

  const addActivity = async () => {
    try {
      await API.post(`/followups/${lead._id}`, {
        note,
        nextFollowUpDate: date
      })

      setNote("")
      setDate("")
      fetchActivities()

    } catch (err) {
      alert(err.response?.data?.message || "Error")
    }
  }

  // whatsapp handler 
  const handleWhatsApp = () => {

    if (!canUseWhatsApp) {
      alert("Upgrade to Enterprise to use WhatsApp feature")
      return
    }

    if (!lead?.phone) {
      return alert("No phone number available")
    }

    let phone = lead.phone.replace(/\D/g, "")

    if (!phone.startsWith("91")) {
      phone = "91" + phone
    }

    const message = `Hi ${lead.name}, I am reaching out regarding your inquiry. Let's connect.`

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    window.open(url, "_blank")

    
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">

      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="
        relative w-full max-w-md
        h-[calc(100vh-4rem)]
        top-16
        bg-white shadow-2xl
        flex flex-col
        animate-slideInRight
      ">

        {/* HEADER */}
        <div className="
          flex items-center justify-between
          px-5 py-4 border-b
          bg-gradient-to-r from-purple-500/10 to-indigo-500/10
        ">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {lead.name}
            </h2>
            <p className="text-xs text-gray-500">
              Lead Details
            </p>
          </div>

          <button onClick={onClose}>
            <X size={18} className="text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* INFO */}
          <div className="space-y-2 text-sm">
            <Info icon={Phone} label="Phone" value={lead.phone} />
            <Info icon={User} label="Assigned" value={lead.assignedTo?.name || "Unassigned"} />
            <Info icon={Calendar} label="Status" value={lead.status} />
          </div>

          
          <div className="flex items-center gap-3">

            <button
              onClick={handleWhatsApp}
              disabled={!canUseWhatsApp}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                ${canUseWhatsApp
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
              title={!canUseWhatsApp ? "Available in Enterprise plan" : ""}
            >
              <MessageCircle size={16} />
              WhatsApp
            </button>

            {!canUseWhatsApp && (
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                Enterprise Only
              </span>
            )}

          </div>

          {/* ADD FOLLOW-UP */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              Add Follow-up
            </h3>

            {isClosed ? (
              <p className="text-sm text-gray-500">
                This lead is closed. No further follow-ups allowed.
              </p>
            ) : (
              <div className="space-y-3">

                <input
                  placeholder="Write note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
                />

                <button
                  onClick={addActivity}
                  className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  Add Follow-up
                </button>

              </div>
            )}
          </div>

          {/* TIMELINE */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              Activity Timeline
            </h3>

            <div className="space-y-3">

              {activities.length === 0 && (
                <p className="text-sm text-gray-400">
                  No activity yet
                </p>
              )}

              {activities.map(a => (
                <div
                  key={a._id}
                  className="p-3 rounded-xl border bg-gray-50 hover:bg-gray-100 transition"
                >
                  <p className="text-sm text-gray-800">
                    {a.note}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    By {a.createdBy?.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

// info row 
function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-gray-700">
      <Icon size={16} className="text-purple-500" />
      <span className="font-medium">{label}:</span>
      <span className="text-gray-600">{value}</span>
    </div>
  )
}