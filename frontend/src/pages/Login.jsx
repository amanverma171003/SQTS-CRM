// import { useState, useEffect } from "react"
// import API from "../services/api"
// import { useNavigate } from "react-router-dom"
// import { useDispatch } from "react-redux"
// import { login } from "../store/slices/authSlice"
// import loginImage from "../assets/sparkque_transparent.png"
// import { FaEye, FaEyeSlash } from "react-icons/fa"

// export default function Login() {

//   const [form, setForm] = useState({ email: "", password: "" })
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState("")

//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//     setError("")
//   }

//   const handleLogin = async () => {
//     try {
//       setLoading(true)
//       setError("")

//       const res = await API.post("/auth/login", form)

//       dispatch(login({
//         token: res.data.token,
//         user: res.data.user
//       }))

//       navigate("/")

//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (token) navigate("/")
//   }, [])

//   return (
//     <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">

//       {/* BACKGROUND BLOBS */}
//       <div className="absolute inset-0 z-0">
//         <div className="absolute w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-3xl top-[-100px] left-[-100px] animate-pulse"></div>
//         <div className="absolute w-[400px] h-[400px] bg-indigo-400/30 rounded-full blur-3xl bottom-[-100px] right-[-100px] animate-pulse"></div>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="relative z-10 flex w-full">

//         {/* LEFT SIDE */}
//         <div className="hidden md:flex flex-1 items-center justify-center relative">
//           <div className="absolute w-[400px] h-[400px] bg-indigo-300/30 blur-3xl rounded-full"></div>

//           <img 
//             src={loginImage} 
//             className="relative w-4/5 max-w-lg drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-105 transition duration-500"
//           />
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="flex flex-1 items-center justify-center p-6">

//           <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl border border-white/20 p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.2)] transition-all duration-300">

//             <h2 className="text-3xl font-bold mb-2 text-gray-800">
//               Welcome Back
//             </h2>

//             <p className="text-gray-500 mb-8">
//               Login to your account
//             </p>

//             {/* ERROR */}
//             {error && (
//               <div className="mb-4 p-3 text-sm bg-red-100 text-red-600 rounded-lg">
//                 {error}
//               </div>
//             )}

//             {/* EMAIL */}
//             <div className="relative mb-6">
//               <input
//                 name="email"
//                 onChange={handleChange}
//                 placeholder=" "
//                 className="peer w-full p-4 border border-transparent rounded-xl bg-white/50 
//                 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all duration-300 p-6"
//               />
//               <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all duration-200 
//                 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
//                 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
//                 Email
//               </label>
//             </div>

//             {/* PASSWORD */}
//             <div className="relative mb-4">
//               <input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 onChange={handleChange}
//                 placeholder=" "
//                 className="peer w-full p-6 border border-transparent rounded-xl bg-white/50 
//                 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all duration-300"
//               />

//               <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all duration-200 
//                 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
//                 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
//                 Password
//               </label>

//               <div
//                 className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-indigo-600 transition"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </div>
//             </div>

//             {/* FORGOT */}
//             <div
//               className="text-right text-sm text-indigo-600 cursor-pointer mb-6 hover:underline"
//               onClick={() => navigate("/forgot-password")}
//             >
//               Forgot password?
//             </div>

//             {/* BUTTON */}
//             <button
//               onClick={handleLogin}
//               disabled={loading}
//               className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold 
//               shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>

//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useState, useEffect, useRef } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "../store/slices/authSlice"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import lottie from "lottie-web"
import animationData from "../assets/dashboard-animation.json"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const animationRef = useRef(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await API.post("/auth/login", form)

      dispatch(login({
        token: res.data.token,
        user: res.data.user
      }))

      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) navigate("/")
  }, [])

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData
    })

    return () => anim.destroy()
  }, [])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-6">

      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-3xl top-[-120px] left-[-120px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-indigo-400/30 rounded-full blur-3xl bottom-[-120px] right-[-120px]"></div>
      </div>

      {/* FLOATING SHADOW */}
      <div className="absolute bottom-10 w-[50%] h-[60px] bg-indigo-300/20 blur-2xl rounded-full"></div>

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.12)] flex flex-col md:flex-row overflow-hidden">

        {/* GLOW BORDER */}
        <div className="absolute inset-0 rounded-3xl border border-white/60 opacity-60 pointer-events-none"></div>

        {/* LIGHT OVERLAY */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none"></div>

        {/* LEFT - ANIMATION */}
        <div className="flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div
            ref={animationRef}
            className="w-full max-w-md h-[260px] md:h-[420px]"
          />
        </div>

        {/* RIGHT - FORM */}
        <div className="flex flex-1 items-center justify-center p-8 md:p-10 bg-white/60">

          <div className="w-full max-w-md">

            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Welcome Back
            </h2>

            <p className="text-gray-500 mb-8">
              Login to your account
            </p>

            {error && (
              <div className="mb-4 p-3 text-sm bg-red-100 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div className="relative mb-6">
              <input
                name="email"
                onChange={handleChange}
                placeholder=" "
                className="peer w-full p-5 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
                Email
              </label>
            </div>

            {/* PASSWORD */}
            <div className="relative mb-4">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full p-5 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
                Password
              </label>

              <div
                className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-indigo-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* FORGOT */}
            <div
              className="text-right text-sm text-indigo-600 cursor-pointer mb-6 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </div>

            {/* BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}