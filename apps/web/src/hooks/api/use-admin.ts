import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Admin Dashboard Stats
export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard")
      if (!res.ok) throw new Error("Failed to fetch dashboard")
      const data = await res.json()
      return data.success ? data.data : null
    },
  })
}

// Admin Users
export function useAdminUsers(params: { page?: number; limit?: number; search?: string; role?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params.page) searchParams.append("page", params.page.toString())
      if (params.limit) searchParams.append("limit", params.limit.toString())
      if (params.search) searchParams.append("search", params.search)
      if (params.role) searchParams.append("role", params.role)
      
      const res = await fetch(`/api/admin/users?${searchParams}`)
      if (!res.ok) throw new Error("Failed to fetch users")
      const data = await res.json()
      return data.success ? data.data : { data: [], pagination: {} }
    },
  })
}

// Admin Students
export function useAdminStudents(params: { page?: number; limit?: number; search?: string; classId?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "students", params],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append("page", params.page.toString())
        if (params.limit) searchParams.append("limit", params.limit.toString())
        if (params.search) searchParams.append("search", params.search)
        if (params.classId) searchParams.append("classId", params.classId)
        
        const res = await fetch(`/api/admin/students?${searchParams}`)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch students")
        }
        const data = await res.json()
        if (process.env.NODE_ENV === 'development') {
          console.log('Students API Response:', data)
        }
        return data.success ? (data.data || { data: [], pagination: {} }) : { data: [], pagination: {} }
      } catch (error) {
        console.error("Error fetching students:", error)
        throw error
      }
    },
  })
}

// Admin Classes
export function useAdminClasses(params: { page?: number; limit?: number; search?: string; isActive?: boolean } = {}) {
  return useQuery({
    queryKey: ["admin", "classes", params],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append("page", params.page.toString())
        if (params.limit) searchParams.append("limit", params.limit.toString())
        if (params.search) searchParams.append("search", params.search)
        if (params.isActive !== undefined) searchParams.append("isActive", params.isActive.toString())
        
        const res = await fetch(`/api/admin/classes?${searchParams}`)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch classes")
        }
        const data = await res.json()
        if (process.env.NODE_ENV === 'development') {
          console.log('Classes API Response:', data)
        }
        return data.success ? (data.data || { data: [], pagination: {} }) : { data: [], pagination: {} }
      } catch (error) {
        console.error("Error fetching classes:", error)
        throw error
      }
    },
  })
}

// Admin Activities
export function useAdminActivities(params: { page?: number; limit?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "activities", params],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append("page", params.page.toString())
        if (params.limit) searchParams.append("limit", params.limit.toString())
        if (params.search) searchParams.append("search", params.search)
        
        const res = await fetch(`/api/admin/activities?${searchParams}`)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch activities")
        }
        const data = await res.json()
        if (process.env.NODE_ENV === 'development') {
          console.log('Activities API Response:', data)
        }
        return data.success ? (data.data || { data: [], pagination: {} }) : { data: [], pagination: {} }
      } catch (error) {
        console.error("Error fetching activities:", error)
        throw error
      }
    },
  })
}

// Admin Assessments
export function useAdminAssessments(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["admin", "assessments", params],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append("page", params.page.toString())
        if (params.limit) searchParams.append("limit", params.limit.toString())
        
        const res = await fetch(`/api/admin/assessments?${searchParams}`)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch assessments")
        }
        const data = await res.json()
        if (process.env.NODE_ENV === 'development') {
          console.log('Assessments API Response:', data)
        }
        return data.success ? (data.data || { data: [], pagination: {} }) : { data: [], pagination: {} }
      } catch (error) {
        console.error("Error fetching assessments:", error)
        throw error
      }
    },
  })
}

// Mutations
export function useDeleteUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete user")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/students/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete student")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })
}

export function useDeleteClass() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/classes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete class")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "classes"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })
}

export function useDeleteActivity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/activities/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete activity")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
    },
  })
}

// Create Mutations
export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to create user")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to create student")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })
}

export function useCreateClass() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to create class")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "classes"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to create activity")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
    },
  })
}

// Update Mutations
export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update user")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update student")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })
}

export function useUpdateClass() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/admin/classes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update class")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "classes"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })
}

export function useUpdateActivity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/admin/activities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update activity")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
    },
  })
}

