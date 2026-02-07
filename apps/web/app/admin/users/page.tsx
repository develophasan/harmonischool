"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@harmoni/ui"
import { Users, Plus, Search, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useAdminUsers, useDeleteUser, useCreateUser, useUpdateUser } from "@/hooks/api/use-admin"

export default function AdminUsersPage() {
  const [pagination, setPagination] = useState({ page: 1, limit: 20 })
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    role: "teacher" as "admin" | "teacher" | "parent",
    phone: "",
    avatarUrl: "",
  })
  
  const { data, isLoading: loading } = useAdminUsers({
    page: pagination.page,
    limit: pagination.limit,
    search: search || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
  })
  
  const deleteUser = useDeleteUser()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  
  const users = data?.data || []
  const paginationData = data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return
    deleteUser.mutate(id)
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      email: user.email || "",
      fullName: user.fullName || "",
      role: user.role || "teacher",
      phone: user.phone || "",
      avatarUrl: user.avatarUrl || "",
    })
    setIsEditModalOpen(true)
  }

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({
      email: "",
      fullName: "",
      role: "teacher",
      phone: "",
      avatarUrl: "",
    })
    setIsCreateModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData: any = {
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
      }
      if (formData.phone) submitData.phone = formData.phone
      if (formData.avatarUrl) submitData.avatarUrl = formData.avatarUrl

      if (editingUser) {
        await updateUser.mutateAsync({ id: editingUser.id, data: submitData })
        setIsEditModalOpen(false)
      } else {
        await createUser.mutateAsync(submitData)
        setIsCreateModalOpen(false)
      }
      setFormData({ email: "", fullName: "", role: "teacher", phone: "", avatarUrl: "" })
    } catch (error) {
      console.error("Error saving user:", error)
      alert("Kullanıcı kaydedilirken hata oluştu: " + (error instanceof Error ? error.message : "Bilinmeyen hata"))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2 tracking-tight text-foreground">Kullanıcı Yönetimi</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Tüm kullanıcıları görüntüle ve yönet</p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Kullanıcı
          </Button>
        </div>

        {/* Filtreler */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="İsim veya email ile ara..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPagination(prev => ({ ...prev, page: 1 }))
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value)
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="flex h-10 w-full sm:w-auto sm:min-w-[150px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">Tüm Roller</option>
                <option value="admin">Admin</option>
                <option value="teacher">Öğretmen</option>
                <option value="parent">Veli</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Kullanıcı Listesi */}
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcılar ({paginationData.total})</CardTitle>
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
            ) : users.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Kullanıcı bulunamadı</p>
            ) : (
              <div className="space-y-2">
                {users.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                              {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Öğretmen' : 'Veli'}
                            </span>
                            {user.phone && (
                              <span className="text-xs text-muted-foreground">{user.phone}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
              <DialogDescription>
                Yeni bir kullanıcı oluşturun
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fullName">Ad Soyad *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rol *</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Öğretmen</option>
                    <option value="parent">Veli</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    type="url"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={createUser.isPending}>
                  {createUser.isPending ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Kullanıcı Düzenle</DialogTitle>
              <DialogDescription>
                Kullanıcı bilgilerini güncelleyin
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-fullName">Ad Soyad *</Label>
                  <Input
                    id="edit-fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Rol *</Label>
                  <select
                    id="edit-role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Öğretmen</option>
                    <option value="parent">Veli</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-phone">Telefon</Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-avatarUrl">Avatar URL</Label>
                  <Input
                    id="edit-avatarUrl"
                    type="url"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={updateUser.isPending}>
                  {updateUser.isPending ? "Güncelleniyor..." : "Güncelle"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
