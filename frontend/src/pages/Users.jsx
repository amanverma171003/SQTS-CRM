import { useEffect, useState } from "react"
import API from "../services/api"
import MainLayout from "../components/layout/MainLayout"
import CreateUserModal from "../components/users/CreateUserModal"
import ManageUserModal from "../components/users/ManageUserModal"
import { useSelector } from "react-redux"
import { FaUser, FaUserShield } from "react-icons/fa"

export default function Users() {

  const [openModal, setOpenModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [admins, setAdmins] = useState([])
  const [normalUsers, setNormalUsers] = useState([])

  const currentUser = useSelector(state => state.auth.user)

  const fetchUsers = async () => {
    const res = await API.get("/users")
    const allUsers = res.data

    setAdmins(allUsers.filter(u => u.role === "clientadmin"))
    setNormalUsers(allUsers.filter(u => u.role === "user"))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <MainLayout>

      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            {currentUser?.role === "superadmin" ? "Users" : "Team Members"}
          </h1>

          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 transition"
          >
            + {currentUser?.role === "superadmin" ? "Create User" : "Add User"}
          </button>
        </div>

        {/* CLIENT ADMINS */}
        {currentUser?.role === "superadmin" && (
          <Section title="Client Admins" icon={<FaUserShield />}>
            <Table type="admin">
              {admins.map(u => (
                <Row
                  key={u._id}
                  user={u}
                  showCompany
                  onManage={() => setSelectedUser(u)}
                />
              ))}
            </Table>
          </Section>
        )}

        {/* USERS */}
        <Section title="Users" icon={<FaUser />}>
          <Table type="user">
            {(currentUser?.role === "clientadmin"
              ? [...admins, ...normalUsers]
              : normalUsers
            ).map(u => (
              <Row
                key={u._id}
                user={u}
                showCompany={currentUser?.role === "superadmin"}
                onManage={() => setSelectedUser(u)}
                hideManage={
                  currentUser?.role === "clientadmin" &&
                  u.role === "clientadmin" &&
                  u._id !== currentUser.userId
                }
              />
            ))}
          </Table>
        </Section>

      </div>

      {/* MODALS */}
      {openModal && (
        <CreateUserModal
          onClose={() => setOpenModal(false)}
          refresh={fetchUsers}
        />
      )}

      {selectedUser && (
        <ManageUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          refresh={fetchUsers}
        />
      )}

    </MainLayout>
  )
}

/* SECTION */

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      <div className="flex items-center gap-2 px-5 py-3 bg-purple-50 text-purple-700 font-medium">
        {icon}
        {title}
      </div>

      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  )
}

// table 

function Table({ children, type }) {
  return (
    <table className="w-full text-sm">

      <thead className="text-gray-500 border-b bg-gray-50">
        <tr>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Phone</th>
          <th className="p-3 text-left">Company</th>

          <th className="p-3 text-left">
            {type === "admin" ? "Status" : "Leads"}
          </th>

          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>{children}</tbody>

    </table>
  )
}

// row 

function Row({ user, onManage, showCompany, hideManage }) {
  return (
    <tr className="border-b hover:bg-purple-50 transition">

      <td className="p-3 font-medium text-gray-800">
        {user.name}
      </td>

      <td className="p-3 text-gray-600">
        {user.email}
      </td>

      <td className="p-3 text-gray-600">
        {user.phone}
      </td>

      <td className="p-3 text-gray-600">
        {showCompany ? user.clientId?.companyName || "-" : "-"}
      </td>

      {/* ROLE-BASED COLUMN */}
      <td className="p-3 text-gray-600">
        {user.role === "clientadmin" ? (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
        ) : (
          user.leadCount || 0
        )}
      </td>

      <td className="p-3">
        {!hideManage && (
          <button
            onClick={onManage}
            className="px-3 py-1 rounded-lg text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
          >
            Manage
          </button>
        )}
      </td>

    </tr>
  )
}