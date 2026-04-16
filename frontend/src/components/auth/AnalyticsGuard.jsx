import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export default function AnalyticsGuard({ children }) {

  const user = useSelector(state => state.auth.user)

  // no user navigate 
  if (!user) {
    return <Navigate to="/login" />
  }

  // check role 
  if (user.role !== "clientadmin") {
    return <div className="p-6">Access Denied</div>
  }

  // plan check 
  if (!["pro", "enterprise"].includes(user.planType)) {
    return (
      <div className="p-6 text-gray-600">
        Upgrade to Pro or Enterprise to access Analytics
      </div>
    )
  }

  return children
}