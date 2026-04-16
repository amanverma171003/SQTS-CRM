import { createSlice } from "@reduxjs/toolkit"

// get user from storage only 
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const initialState = {
  user: getUserFromStorage(),
  isAuthenticated: !!getUserFromStorage()
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    // LOGIN 
    login: (state, action) => {
      state.user = action.payload.user
      state.isAuthenticated = true

      localStorage.setItem("user", JSON.stringify(action.payload.user))
    },

    // LOGOUT
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false

      localStorage.removeItem("user")
    }

  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer