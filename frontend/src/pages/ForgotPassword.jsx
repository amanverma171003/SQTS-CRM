import { useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"
import loginImage from "../assets/sparkque_transparent.png"

export default function ForgotPassword() {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError("")
      setMessage("")

      const res = await API.post("/auth/forgot-password", { email })

      setMessage(res.data.message)

    } catch (err) {
      setError(err.response?.data?.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">

      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-3xl top-[-100px] left-[-100px] animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-indigo-400/30 rounded-full blur-3xl bottom-[-100px] right-[-100px] animate-pulse"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex w-full">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-1 items-center justify-center relative">
          <div className="absolute w-[400px] h-[400px] bg-indigo-300/30 blur-3xl rounded-full"></div>

          <img
            src={loginImage}
            className="relative w-4/5 max-w-lg drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-1 items-center justify-center p-6">

          <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl border border-white/20 p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]">

            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Forgot Password
            </h2>

            <p className="text-gray-500 mb-8">
              Enter your email to receive a reset link
            </p>

            {/* SUCCESS */}
            {message && (
              <div className="mb-4 p-3 text-sm bg-green-100 text-green-600 rounded-lg">
                {message}
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="mb-4 p-3 text-sm bg-red-100 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div className="relative mb-6">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer w-full p-4 border border-transparent rounded-xl bg-white/50 
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all duration-300"
              />

              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all duration-200 
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
                Email
              </label>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold 
              shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* BACK TO LOGIN */}
            <div
              className="text-center text-sm text-indigo-600 cursor-pointer mt-6 hover:underline"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}