"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PlusCircle, Search, Edit, Trash2, Loader2, RefreshCw } from "lucide-react" // Added RefreshCw
import { useToast } from "@/hooks/use-toast"
import { useFirestore } from "@/lib/firebase/firestore"
import { UserForm } from "@/components/admin/user-form"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"

interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
  status: string
}

export default function UsersPage() {
  const { toast } = useToast()
  const { getDocuments, deleteDocument, loading: firestoreLoading } = useFirestore("users")
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null) // Added fetchError state

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const lowercasedSearch = searchTerm.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(lowercasedSearch) ||
            user.email.toLowerCase().includes(lowercasedSearch) ||
            user.role.toLowerCase().includes(lowercasedSearch) ||
            (user.department && user.department.toLowerCase().includes(lowercasedSearch)),
        ),
      )
    }
  }, [searchTerm, users])

  const fetchUsers = async () => {
    setIsLoading(true)
    setFetchError(null) // Reset error state on new fetch
    try {
      const usersData = await getDocuments()
      setUsers(usersData as User[])
      setFilteredUsers(usersData as User[])
    } catch (error: any) {
      console.error("Error fetching users:", error)
      const errorMessage = error.message || "Terjadi kesalahan saat memuat data pengguna"
      setFetchError(errorMessage)
      toast({
        title: "Gagal memuat pengguna",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditUserOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteUserOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!selectedUser) return

    setIsDeleting(true)
    try {
      await deleteDocument(selectedUser.id)
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id))
      toast({
        title: "Pengguna dihapus",
        description: `${selectedUser.name} telah berhasil dihapus`,
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Gagal menghapus pengguna",
        description: "Terjadi kesalahan saat menghapus pengguna",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteUserOpen(false)
      setSelectedUser(null)
    }
  }

  const handleFormSuccess = () => {
    fetchUsers()
    setIsAddUserOpen(false)
    setIsEditUserOpen(false)
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Pengguna"
        description="Kelola pengguna dalam sistem"
        actions={
          <Button onClick={() => setIsAddUserOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        }
      />

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Cari pengguna..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : fetchError ? (
        <EmptyState
          variant="error"
          title="Gagal Memuat Pengguna"
          description={fetchError}
          action={
            <Button onClick={fetchUsers}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Coba Lagi
            </Button>
          }
        />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="Tidak ada pengguna ditemukan"
          description={
            searchTerm
              ? `Tidak ada pengguna yang cocok dengan pencarian "${searchTerm}"`
              : "Belum ada pengguna dalam sistem"
          }
          action={
            <Button onClick={() => setIsAddUserOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Departemen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : user.role === "validator" ? "secondary" : "outline"}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "success" : "destructive"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            <DialogDescription>Buat akun pengguna baru dengan izin peran tertentu.</DialogDescription>
          </DialogHeader>
          <UserForm onSuccess={handleFormSuccess} onCancel={() => setIsAddUserOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>Perbarui informasi pengguna.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm user={selectedUser} onSuccess={handleFormSuccess} onCancel={() => setIsEditUserOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      {selectedUser && (
        <DeleteConfirmation
          isOpen={isDeleteUserOpen}
          onClose={() => setIsDeleteUserOpen(false)}
          onConfirm={confirmDeleteUser}
          title="Hapus Pengguna"
          description={`Apakah Anda yakin ingin menghapus ${selectedUser.name}? Tindakan ini tidak dapat dibatalkan.`}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
