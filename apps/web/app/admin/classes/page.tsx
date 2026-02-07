"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@harmoni/ui"
import { BookOpen, Plus, Search, Edit, Trash2, Users } from "lucide-react"
import { useAdminClasses, useDeleteClass, useCreateClass, useUpdateClass } from "@/hooks/api/use-admin"

export default function AdminClassesPage() {
  const [pagination, setPagination] = useState({ page: 1, limit: 20 })
  const [search, setSearch] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    ageGroup: "",
    capacity: 20,
    academicYear: "",
  })
  
  const { data, isLoading: loading, error } = useAdminClasses({
    page: pagination.page,
    limit: pagination.limit,
    search: search || undefined,
  })
  
  const deleteClass = useDeleteClass()
  const createClass = useCreateClass()
  const updateClass = useUpdateClass()
  
  const classes = data?.data || []
  const paginationData = data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }

  // Set current academic year as default
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const nextYear = currentYear + 1
    setFormData(prev => ({ ...prev, academicYear: `${currentYear}-${nextYear}` }))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Bu sınıfı silmek istediğinizden emin misiniz?')) return
    deleteClass.mutate(id)
  }

  const handleEdit = (classData: any) => {
    setEditingClass(classData)
    setFormData({
      name: classData.name || "",
      ageGroup: classData.ageGroup || "",
      capacity: classData.capacity || 20,
      academicYear: classData.academicYear || "",
    })
    setIsEditModalOpen(true)
  }

  const handleCreate = () => {
    setEditingClass(null)
    const currentYear = new Date().getFullYear()
    const nextYear = currentYear + 1
    setFormData({
      name: "",
      ageGroup: "",
      capacity: 20,
      academicYear: `${currentYear}-${nextYear}`,
    })
    setIsCreateModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingClass) {
        await updateClass.mutateAsync({ id: editingClass.id, data: formData })
        setIsEditModalOpen(false)
      } else {
        await createClass.mutateAsync(formData)
        setIsCreateModalOpen(false)
      }
    } catch (error) {
      console.error("Error saving class:", error)
      alert("Sınıf kaydedilirken hata oluştu: " + (error instanceof Error ? error.message : "Bilinmeyen hata"))
    }
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

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Sınıf Yönetimi</h1>
            <p className="text-muted-foreground">Tüm sınıfları görüntüle ve yönet</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Sınıf
          </Button>
        </div>

        {/* Arama */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sınıf adı ile ara..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sınıf Listesi */}
        <Card>
          <CardHeader>
            <CardTitle>Sınıflar ({paginationData.total})</CardTitle>
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
            ) : classes.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Sınıf bulunamadı</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((classData: any) => (
                  <Card key={classData.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{classData.name}</CardTitle>
                        <span
                          className={`text-xs px-2 py-1 rounded-md font-medium ${
                            classData.isActive
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {classData.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      <CardDescription>
                        {classData.ageGroup} yaş grubu • {classData.academicYear}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {classData.classStudents?.length || 0} / {classData.capacity} öğrenci
                          </span>
                        </div>
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${classData.capacity > 0 ? ((classData.classStudents?.length || 0) / classData.capacity) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(classData)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Düzenle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(classData.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Sınıf Ekle</DialogTitle>
              <DialogDescription>
                Yeni bir sınıf oluşturun
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Sınıf Adı *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ageGroup">Yaş Grubu * (örn: 3-4)</Label>
                  <Input
                    id="ageGroup"
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    placeholder="3-4"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Kapasite *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="academicYear">Akademik Yıl * (örn: 2024-2025)</Label>
                  <Input
                    id="academicYear"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="2024-2025"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={createClass.isPending}>
                  {createClass.isPending ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Sınıf Düzenle</DialogTitle>
              <DialogDescription>
                Sınıf bilgilerini güncelleyin
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-name">Sınıf Adı *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-ageGroup">Yaş Grubu * (örn: 3-4)</Label>
                  <Input
                    id="edit-ageGroup"
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-capacity">Kapasite *</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-academicYear">Akademik Yıl * (örn: 2024-2025)</Label>
                  <Input
                    id="edit-academicYear"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={updateClass.isPending}>
                  {updateClass.isPending ? "Güncelleniyor..." : "Güncelle"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
