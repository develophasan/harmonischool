"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@harmoni/ui"
import { GraduationCap, Plus, Search, Edit, Trash2, BookOpen } from "lucide-react"
import { useAdminStudents, useAdminClasses, useDeleteStudent, useCreateStudent, useUpdateStudent } from "@/hooks/api/use-admin"

export default function AdminStudentsPage() {
  const [pagination, setPagination] = useState({ page: 1, limit: 20 })
  const [search, setSearch] = useState("")
  const [selectedClassId, setSelectedClassId] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "" as "male" | "female" | "other" | "",
    photoUrl: "",
    enrollmentDate: "",
  })
  
  // Tüm aktif sınıfları çek (filtre için)
  const { data: classesData, isLoading: classesLoading } = useAdminClasses({ 
    page: 1, 
    limit: 100,
    isActive: true, // Sadece aktif sınıfları getir
  })
  const allClasses = classesData?.data || []
  // İsme göre sırala
  const classes = allClasses.sort((a: any, b: any) => a.name.localeCompare(b.name))
  
  // Debug: Sınıfları kontrol et
  if (process.env.NODE_ENV === 'development') {
    console.log('Active classes for filter:', classes)
  }
  
  const { data, isLoading: loading, error } = useAdminStudents({
    page: pagination.page,
    limit: pagination.limit,
    search: search || undefined,
    classId: selectedClassId !== "all" ? selectedClassId : undefined,
  })
  
  const deleteStudent = useDeleteStudent()
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  
  // Debug: API response'u kontrol et
  if (data && process.env.NODE_ENV === 'development') {
    console.log('Admin Students Data:', data)
  }
  
  const students = data?.data || []
  const paginationData = data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }
  
  // Debug: Parse edilmiş verileri kontrol et
  if (process.env.NODE_ENV === 'development') {
    console.log('Students:', students)
    console.log('Pagination:', paginationData)
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Hata: {error instanceof Error ? error.message : 'Bilinmeyen hata'}</p>
          <Button onClick={() => window.location.reload()}>Yeniden Dene</Button>
        </div>
      </div>
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) return
    deleteStudent.mutate(id)
  }

  const handleEdit = (student: any) => {
    setEditingStudent(student)
    setFormData({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : "",
      gender: student.gender || "",
      photoUrl: student.photoUrl || "",
      enrollmentDate: student.enrollmentDate ? new Date(student.enrollmentDate).toISOString().split('T')[0] : "",
    })
    setIsEditModalOpen(true)
  }

  const handleCreate = () => {
    setEditingStudent(null)
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      photoUrl: "",
      enrollmentDate: "",
    })
    setIsCreateModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
      }
      if (formData.gender) submitData.gender = formData.gender
      if (formData.photoUrl) submitData.photoUrl = formData.photoUrl
      if (formData.enrollmentDate) submitData.enrollmentDate = formData.enrollmentDate

      if (editingStudent) {
        await updateStudent.mutateAsync({ id: editingStudent.id, data: submitData })
        setIsEditModalOpen(false)
      } else {
        await createStudent.mutateAsync(submitData)
        setIsCreateModalOpen(false)
      }
      setFormData({ firstName: "", lastName: "", dateOfBirth: "", gender: "", photoUrl: "", enrollmentDate: "" })
    } catch (error) {
      console.error("Error saving student:", error)
      alert("Öğrenci kaydedilirken hata oluştu: " + (error instanceof Error ? error.message : "Bilinmeyen hata"))
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2 tracking-tight text-foreground">Öğrenci Yönetimi</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Tüm öğrencileri görüntüle ve yönet</p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Öğrenci
          </Button>
        </div>

        {/* Filtreler */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Arama */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="İsim ile ara..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  className="pl-10"
                />
              </div>
              
              {/* Sınıf Filtresi */}
              <div>
                <Label htmlFor="class-filter" className="mb-2 block text-sm font-medium">
                  Sınıf Filtresi
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    id="class-filter"
                    value={selectedClassId}
                    onChange={(e) => {
                      setSelectedClassId(e.target.value)
                      setPagination(prev => ({ ...prev, page: 1 }))
                    }}
                    disabled={classesLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">Tüm Sınıflar</option>
                    {classesLoading ? (
                      <option value="" disabled>Yükleniyor...</option>
                    ) : classes.length === 0 ? (
                      <option value="" disabled>Sınıf bulunamadı</option>
                    ) : (
                      classes.map((classItem: any) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.name} - {classItem.ageGroup} yaş ({classItem.academicYear})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Aktif Filtreler */}
            {(selectedClassId !== "all" || search) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedClassId !== "all" && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                    <span>
                      Sınıf: {classes.find((c: any) => c.id === selectedClassId)?.name || "Bilinmeyen"}
                    </span>
                    <button
                      onClick={() => setSelectedClassId("all")}
                      className="ml-2 hover:text-primary/80"
                    >
                      ×
                    </button>
                  </div>
                )}
                {search && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                    <span>Arama: {search}</span>
                    <button
                      onClick={() => setSearch("")}
                      className="ml-2 hover:text-primary/80"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Öğrenci Listesi */}
        <Card>
          <CardHeader>
            <CardTitle>Öğrenciler ({paginationData.total})</CardTitle>
            <CardDescription>
              Sayfa {paginationData.page} / {paginationData.totalPages}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            ) : students.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Öğrenci bulunamadı</p>
            ) : (
              <div className="space-y-2">
                {students.map((student: any) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {calculateAge(student.dateOfBirth)} yaşında
                            {student.gender && ` • ${student.gender === 'male' ? 'Erkek' : 'Kız'}`}
                            {student.classStudents && student.classStudents.length > 0 && (
                              ` • ${student.classStudents[0].class.name}`
                            )}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-md mt-1 inline-block font-medium ${
                              student.isActive
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {student.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {paginationData.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  disabled={paginationData.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Önceki
                </Button>
                <span className="text-sm text-muted-foreground">
                  Sayfa {paginationData.page} / {paginationData.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={paginationData.page === paginationData.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Sonraki
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Yeni Öğrenci Ekle</DialogTitle>
              <DialogDescription>
                Yeni bir öğrenci oluşturun
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="firstName">Ad *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Soyad *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Doğum Tarihi *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Cinsiyet</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Seçiniz</option>
                    <option value="male">Erkek</option>
                    <option value="female">Kız</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="enrollmentDate">Kayıt Tarihi</Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="photoUrl">Fotoğraf URL</Label>
                  <Input
                    id="photoUrl"
                    type="url"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={createStudent.isPending}>
                  {createStudent.isPending ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Öğrenci Düzenle</DialogTitle>
              <DialogDescription>
                Öğrenci bilgilerini güncelleyin
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-firstName">Ad *</Label>
                  <Input
                    id="edit-firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lastName">Soyad *</Label>
                  <Input
                    id="edit-lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dateOfBirth">Doğum Tarihi *</Label>
                  <Input
                    id="edit-dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-gender">Cinsiyet</Label>
                  <select
                    id="edit-gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Seçiniz</option>
                    <option value="male">Erkek</option>
                    <option value="female">Kız</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-enrollmentDate">Kayıt Tarihi</Label>
                  <Input
                    id="edit-enrollmentDate"
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-photoUrl">Fotoğraf URL</Label>
                  <Input
                    id="edit-photoUrl"
                    type="url"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={updateStudent.isPending}>
                  {updateStudent.isPending ? "Güncelleniyor..." : "Güncelle"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

