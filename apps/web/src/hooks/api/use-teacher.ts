import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Teacher ID hook
export function useTeacherId() {
  return useQuery({
    queryKey: ["teacher", "id"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/test/teacher-id")
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch teacher ID")
        }
        const data = await res.json()
        if (!data.success || !data.teacher?.id) {
          throw new Error("Teacher ID not found")
        }
        return data.teacher.id as string
      } catch (error) {
        console.error("Error fetching teacher ID:", error)
        throw error
      }
    },
    staleTime: 10 * 60 * 1000, // 10 dakika - teacher ID değişmez
    retry: 2, // 2 kez daha dene
  })
}

// Teacher Classes
export function useTeacherClasses(teacherId: string | null) {
  return useQuery({
    queryKey: ["teacher", "classes", teacherId],
    queryFn: async () => {
      if (!teacherId) return []
      try {
        const res = await fetch(`/api/teacher/classes?teacherId=${teacherId}`)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch classes")
        }
        const data = await res.json()
        return data.success ? (data.data || []) : []
      } catch (error) {
        console.error("Error fetching classes:", error)
        throw error
      }
    },
    enabled: !!teacherId,
    retry: 1,
  })
}

// Teacher Class Detail
export function useTeacherClass(classId: string | null) {
  return useQuery({
    queryKey: ["teacher", "class", classId],
    queryFn: async () => {
      if (!classId) return null
      const res = await fetch(`/api/teacher/class/${classId}`)
      if (!res.ok) throw new Error("Failed to fetch class")
      const data = await res.json()
      return data.success ? data.data : null
    },
    enabled: !!classId,
  })
}

// Teacher Students (from all classes)
export function useTeacherStudents(teacherId: string | null) {
  return useQuery({
    queryKey: ["teacher", "students", teacherId],
    queryFn: async () => {
      if (!teacherId) return []
      
      // Önce sınıfları al
      const classesRes = await fetch(`/api/teacher/classes?teacherId=${teacherId}`)
      if (!classesRes.ok) throw new Error("Failed to fetch classes")
      const classesData = await classesRes.json()
      const classes = classesData.success ? classesData.data : []
      
      if (!classes || classes.length === 0) return []
      
      const allStudents: any[] = []
      const seenStudentIds = new Set<string>()
      
      for (const classData of classes) {
        if (classData.students && Array.isArray(classData.students)) {
          classData.students.forEach((student: any) => {
            if (!seenStudentIds.has(student.id)) {
              seenStudentIds.add(student.id)
              allStudents.push({
                ...student,
                classStudents: [{
                  class: {
                    name: classData.name,
                  },
                }],
              })
            }
          })
        }
      }
      
      return allStudents
    },
    enabled: !!teacherId,
  })
}

// Teacher Student Detail
export function useTeacherStudent(studentId: string | null) {
  return useQuery({
    queryKey: ["teacher", "student", studentId],
    queryFn: async () => {
      if (!studentId) return null
      const res = await fetch(`/api/teacher/student/${studentId}`)
      if (!res.ok) throw new Error("Failed to fetch student")
      const data = await res.json()
      return data.success ? data.data : null
    },
    enabled: !!studentId,
  })
}

// Teacher Stats
export function useTeacherStats(teacherId: string | null) {
  return useQuery({
    queryKey: ["teacher", "stats", teacherId],
    queryFn: async () => {
      if (!teacherId) return null
      try {
        const res = await fetch(`/api/teacher/stats?teacherId=${teacherId}`)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch stats")
        }
        const data = await res.json()
        return data.success ? (data.data || null) : null
      } catch (error) {
        console.error("Error fetching stats:", error)
        throw error
      }
    },
    enabled: !!teacherId,
    retry: 1,
  })
}

// Teacher Activities
export function useTeacherActivities(teacherId: string | null, studentId?: string | null) {
  return useQuery({
    queryKey: ["teacher", "activities", teacherId, studentId],
    queryFn: async () => {
      if (!teacherId) return []
      try {
        const params = new URLSearchParams({ teacherId })
        if (studentId) params.append("studentId", studentId)
        
        const res = await fetch(`/api/teacher/activities?${params}`)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch activities")
        }
        const data = await res.json()
        return data.success ? (data.data || []) : []
      } catch (error) {
        console.error("Error fetching activities:", error)
        throw error
      }
    },
    enabled: !!teacherId,
    retry: 1,
  })
}

// Teacher Assessments
export function useTeacherAssessments(teacherId: string | null, studentId?: string | null) {
  return useQuery({
    queryKey: ["teacher", "assessments", teacherId, studentId],
    queryFn: async () => {
      if (!teacherId) return []
      const params = new URLSearchParams({ teacherId })
      if (studentId) params.append("studentId", studentId)
      
      const res = await fetch(`/api/teacher/assessments?${params}`)
      if (!res.ok) throw new Error("Failed to fetch assessments")
      const data = await res.json()
      return data.success ? data.data : []
    },
    enabled: !!teacherId,
  })
}

// Teacher Daily Logs
export function useTeacherDailyLogs(teacherId: string | null, studentId?: string | null) {
  return useQuery({
    queryKey: ["teacher", "daily-logs", teacherId, studentId],
    queryFn: async () => {
      if (!teacherId) return []
      const params = new URLSearchParams({ teacherId })
      if (studentId) params.append("studentId", studentId)
      
      const res = await fetch(`/api/teacher/daily-logs?${params}`)
      if (!res.ok) throw new Error("Failed to fetch daily logs")
      const data = await res.json()
      return data.success ? data.data : []
    },
    enabled: !!teacherId,
  })
}

// Mutations
export function useCreateAssessment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/teacher/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create assessment")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assessments"] })
      queryClient.invalidateQueries({ queryKey: ["teacher", "stats"] })
    },
  })
}

export function useCreateDailyLog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/teacher/daily-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create daily log")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "daily-logs"] })
    },
  })
}

