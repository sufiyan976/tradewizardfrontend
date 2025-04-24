"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  user: any | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching user data (replace with actual authentication logic)
    const fetchUser = async () => {
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate a logged-in user
      setUser({
        id: "user123",
        name: "Test User",
        email: "test@example.com",
      })
      setIsLoading(false)
    }

    fetchUser()

    // Simulate no user found
    // setIsLoading(false);
  }, [])

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext)
}
