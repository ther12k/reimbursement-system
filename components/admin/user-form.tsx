"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useFirestore } from "@/lib/firebase/firestore"

interface UserFormProps {
  user?: {
    id: string
    name: string
    email: string
    role: string
    department?: string
    status: string
  }
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const { toast } = useToast()
  const { addDocument, updateDocument } = useFirestore("users")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "user",
    department: user?.department || "",
    status: user?.status || "active",
    password: "", // Only used for new users
  })

  const isEditMode = !!user

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditMode && user) {
        // Update existing user
        await updateDocument(user.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          status: formData.status,
        })

        toast({
          title: "Pengguna diperbarui",
          description: `${formData.name} telah berhasil diperbarui`,
        })
      } else {
        // Create new user
        if (!formData.password) {
          toast({
            title: "Password diperlukan",
            description: "Silakan masukkan password untuk pengguna baru",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // In a real app, you would use Firebase Auth to create the user
        // For this demo, we'll just add to Firestore
        await addDocument({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          status: formData.status,
          // Don't store plain text password in Firestore in a real app
          // This is just for demo purposes
          passwordHash: "demo-hash",
        })

        toast({
          title: "Pengguna ditambahkan",
          description: `${formData.name} telah berhasil ditambahkan`,
        })
      }

      onSuccess()
    } catch (error) {
      console.error("Error saving user:", error)
      toast({
        title: "Gagal menyimpan pengguna",
        description: "Terjadi kesalahan saat menyimpan data pengguna",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="John Doe"
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="john@example.com"
          required
          disabled={isLoading || isEditMode} // Email can't be changed in edit mode
        />
      </div>

      {!isEditMode && (
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            required={!isEditMode}
            disabled={isLoading}
          />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="role">Peran</Label>
        <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)} disabled={isLoading}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Pilih peran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="validator">Validator</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="department">Departemen</Label>
        <Input
          id="department"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          placeholder="Marketing, Finance, etc."
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="status">Status Aktif</Label>
        <Switch
          id="status"
          checked={formData.status === "active"}
          onCheckedChange={handleStatusChange}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : isEditMode ? "Perbarui Pengguna" : "Tambah Pengguna"}
        </Button>
      </div>
    </form>
  )
}
