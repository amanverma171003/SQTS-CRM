import { X } from "lucide-react"

export default function AuditModal({ log, onClose }) {

  if (!log) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >

      {/* MODAL BOX */}
      <div
        className="bg-white w-[520px] max-h-[80vh] overflow-y-auto rounded-2xl shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <h2 className="text-xl font-semibold mb-4">
          Activity Details
        </h2>

        {/* CONTENT */}
        <div className="space-y-5 text-sm">

          {/* ACTION */}
          <Section title="Action">
            {log.type}
          </Section>

          {/* MESSAGE */}
          <Section title="Description">
            {log.message || "—"}
          </Section>

          {/* USER */}
          <Section title="Performed By">
            <div className="space-y-1">
              <p><b>Name:</b> {log.createdBy?.name || "—"}</p>
              <p><b>Email:</b> {log.createdBy?.email || "—"}</p>
              <p><b>Role:</b> {log.createdBy?.role || "—"}</p>
            </div>
          </Section>

          {/* COMPANY */}
          <Section title="Company">
            {log.clientId?.companyName || "—"}
          </Section>

          {/* LEAD INFO */}
          {log.leadId && (
            <Section title="Lead Info">
              <div className="space-y-1">
                <p><b>Name:</b> {log.leadId?.name}</p>
                <p><b>Phone:</b> {log.leadId?.phone}</p>
              </div>
            </Section>
          )}

          {/* META */}
          {log.meta && Object.keys(log.meta).length > 0 && (
            <Section title="Additional Info">
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(log.meta, null, 2)}
              </pre>
            </Section>
          )}

          {/* TIME */}
          <Section title="Timestamp">
            {new Date(log.createdAt).toLocaleString()}
          </Section>

        </div>

      </div>
    </div>
  )
}


// section component

function Section({ title, children }) {
  return (
    <div>
      <p className="text-gray-500 mb-1">{title}</p>
      <div className="bg-gray-50 p-3 rounded-lg">
        {children}
      </div>
    </div>
  )
}