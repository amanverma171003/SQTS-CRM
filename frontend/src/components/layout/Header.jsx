import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../store/slices/authSlice"
import { ChevronDown } from "lucide-react"

export default function Header() {

  const user = useSelector(state => state.auth.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const title =
    user?.role === "superadmin"
      ? "Super Admin Panel"
      : user?.role === "clientadmin"
      ? "Client Admin Panel"
      : `${user?.name || "User"}'s Panel`

  return (
    <div className="w-full px-6 py-4 border-b border-gray-200 bg-white/70 backdrop-blur-xl flex items-center justify-between h-[72px]">

      {/* TITLE */}
      <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
        {title}
      </h1>

      {/* PROFILE */}
      <div className="flex items-center gap-4">

        <div className="flex items-center gap-3 cursor-pointer group">

          {/* AVATAR */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 
            flex items-center justify-center text-white font-semibold shadow-md">
            {user?.name?.[0]}
          </div>

          {/* name and role */}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>

          <ChevronDown size={16} className="text-gray-500 group-hover:rotate-180 transition" />
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 transition"
        >
          Logout
        </button>

      </div>
    </div>
  )
}