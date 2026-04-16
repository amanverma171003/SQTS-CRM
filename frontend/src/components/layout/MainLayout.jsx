import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"

export default function MainLayout({ children }) {

  const [collapsed, setCollapsed] = useState(false)

  const sidebarWidth = collapsed ? 80 : 260

  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <div
        className="fixed left-0 top-0 h-screen z-50 transition-all duration-300"
        style={{ width: sidebarWidth }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* RIGHT SIDE */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >

        {/* HEADER */}
        <div
          className="fixed top-0 right-0 z-40 transition-all duration-300"
          style={{ left: sidebarWidth }}
        >
          <Header />
        </div>

        {/* CONTENT */}
        <div className="mt-[72px] h-[calc(100vh-72px)] overflow-y-auto p-6 flex-1 overflow-x-hidden bg-gray-50">
          {children}
        </div>

      </div>
    </div>
  )
}