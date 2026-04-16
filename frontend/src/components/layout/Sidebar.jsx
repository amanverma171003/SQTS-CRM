import { Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../store/slices/authSlice"
import {
  LayoutDashboard,
  Users,
  Building2,
  Kanban,
  List,
  LogOut,
  Menu,
  BarChart3,
  FileText  
} from "lucide-react"

export default function Sidebar({ collapsed, setCollapsed }) {

  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    dispatch(logout())
    window.location.href = "/login"
  }

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = isActive(to)

    return (
      <Link to={to} className="relative group">

        {/* ACTIVE BAR */}
        {active && (
          <div className="absolute left-0 top-2 bottom-2 w-1 bg-purple-500 rounded-r-full"></div>
        )}

        <div className={`
          flex items-center gap-3 px-4 py-3 rounded-xl
          transition-all duration-200
          ${active
            ? "bg-white/70 text-purple-600 shadow-sm"
            : "text-gray-700 hover:bg-white/40"
          }
        `}>
          <Icon size={20} />

          {!collapsed && (
            <span className="font-medium whitespace-nowrap">
              {label}
            </span>
          )}
        </div>

        {/* TOOLTIP */}
        {collapsed && (
          <div className="
            absolute left-16 top-1/2 -translate-y-1/2
            bg-black text-white text-xs px-2 py-1 rounded
            opacity-0 group-hover:opacity-100 transition
            whitespace-nowrap z-50
          ">
            {label}
          </div>
        )}
      </Link>
    )
  }

  return (
    <div className="
      h-screen w-full
      bg-gradient-to-b from-white/60 to-purple-100/60
      backdrop-blur-xl border-r border-white/20
      flex flex-col justify-between
      transition-all duration-300
    ">

      {/* TOP */}
      <div>

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-5">

          {!collapsed && (
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              SQTS CRM
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/50 transition"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* NAV */}
        <div className="px-3 mt-4 space-y-1">

          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />

          {user?.role === "superadmin" && (
            <>
              <NavItem to="/clients" icon={Building2} label="Clients" />
              <NavItem to="/users" icon={Users} label="Users" />
              <NavItem
                to="/audit-logs"
                icon={FileText}
                label="Audit Logs"
              />
            </>
          )}

          {user?.role === "clientadmin" && (
            <>
              <NavItem to="/leads" icon={List} label="Leads" />
              <NavItem to="/pipeline" icon={Kanban} label="Pipeline" />
              <NavItem to="/users" icon={Users} label="Users" />

              {/* ADVANCED ANALYTICS (FEATURE-BASED) */}
              {user?.features?.advancedReports && (
                <NavItem
                  to="/analytics"
                  icon={BarChart3}
                  label="Advanced Analytics"
                />
              )}
            </>
          )}

          {user?.role === "user" && (
            <>
              <NavItem to="/leads" icon={List} label="My Leads" />
              <NavItem to="/pipeline" icon={Kanban} label="My Pipeline" />
            </>
          )}

        </div>
      </div>

      {/* BOTTOM */}
      <div className="p-4">

        {!collapsed && (
          <div className="
            flex items-center gap-3
            bg-white/60 backdrop-blur-md
            p-3 rounded-xl shadow-sm
          ">
            <div className="
              w-10 h-10 rounded-full
              bg-gradient-to-r from-purple-500 to-indigo-500
              flex items-center justify-center text-white font-bold
            ">
              {user?.name?.[0]}
            </div>

            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        )}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            mt-4 flex items-center gap-2
            text-gray-600 hover:text-red-500
            transition
          "
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>

      </div>
    </div>
  )
}