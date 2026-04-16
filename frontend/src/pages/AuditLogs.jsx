import { useEffect, useState } from "react"
import API from "../services/api"
import MainLayout from "../components/layout/MainLayout"
import AuditModal from "../components/audit/AuditModal"

export default function AuditLogs() {

  const [logs, setLogs] = useState([])
  const [selected, setSelected] = useState(null)

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  
  const [search, setSearch] = useState("")
  const [action, setAction] = useState("")
  const [user, setUser] = useState("")

  // fetch api
  const fetchLogs = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true)

      const res = await API.get("/activities/audit", {
        params: {
          page: pageNum,
          limit: 20,
          search,
          action,
          user
        }
      })

      if (reset) {
        setLogs(res.data.logs)
      } else {
        setLogs(prev => [...prev, ...res.data.logs])
      }

      setHasMore(res.data.pagination.hasMore)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // initial load
  useEffect(() => {
    fetchLogs(1, true)
  }, [])


  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1)
      fetchLogs(1, true)
    }, 400)

    return () => clearTimeout(delay)
  }, [search, action, user])

  // infinit scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.scrollHeight &&
        hasMore &&
        !loading
      ) {
        const next = page + 1
        setPage(next)
        fetchLogs(next)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [page, hasMore, loading])

  return (
    <MainLayout>

      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Audit Logs
          </h1>
          <p className="text-sm text-gray-500">
            Monitor all system activity
          </p>
        </div>

        {/*  FILTER BAR */}
        <div className="flex flex-wrap gap-3">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg w-60"
          />

          {/* ACTION FILTER */}
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Actions</option>
            <option value="LEAD_CREATED">Lead Created</option>
            <option value="LEAD_ASSIGNED">Lead Assigned</option>
            <option value="STATUS_CHANGED">Status Changed</option>
            <option value="USER_CREATED">User Created</option>
          </select>

          {/* USER FILTER */}
          <input
            type="text"
            placeholder="Filter by user..."
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />

        </div>

        
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-left">Time</th>
              </tr>
            </thead>

            <tbody>

              {logs.map((log) => (
                <tr
                  key={log._id}
                  onClick={() => setSelected(log)}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-3 font-medium">{log.type}</td>
                  <td className="p-3">{log.createdBy?.name}</td>
                  <td className="p-3">{log.clientId?.companyName}</td>
                  <td className="p-3 text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

          {!loading && logs.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No logs found
            </div>
          )}

        </div>

        {loading && (
          <div className="text-center text-gray-500">
            Loading...
          </div>
        )}

        {/* MODAL */}
        {selected && (
          <AuditModal
            log={selected}
            onClose={() => setSelected(null)}
          />
        )}

      </div>
      
      <div className="flex justify-between items-center mt-4">

        <button
          disabled={page === 1}
          onClick={() => {
            const prev = page - 1
            setPage(prev)
            fetchLogs(prev, true)
          }}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-500">
          Page {page}
        </span>

        <button
          disabled={!hasMore}
          onClick={() => {
            const next = page + 1
            setPage(next)
            fetchLogs(next, true)
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </MainLayout>
  )
}
