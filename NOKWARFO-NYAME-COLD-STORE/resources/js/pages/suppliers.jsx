import { useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Edit, Trash2, Phone } from "lucide-react"
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/InputError';
import { useState } from 'react';

function Suppliers({ suppliers = [], errors = {} }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const { data, setData, post, put, processing, reset } = useForm({
    name: '',
    phone: '',
    additional_info: '',
  });

  const breadcrumbs = [
    { title: 'Suppliers', href: '/suppliers' },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    post(route('suppliers.store'), {
      onSuccess: () => {
        reset();
        setIsAddModalOpen(false);
      },
      preserveScroll: true,
      preserveState: true,
      only: ["suppliers", "errors", "flash"],
    });
  }

  function handleEdit(supplier) {
    setEditingSupplier(supplier);
    setData({
      name: supplier.name,
      phone: supplier.phone || '',
      additional_info: supplier.additional_info || '',
    });
    setIsEditModalOpen(true);
  }

  function handleUpdate(e) {
    e.preventDefault();
    put(route('suppliers.update', editingSupplier.id), {
      onSuccess: () => {
        reset();
        setIsEditModalOpen(false);
        setEditingSupplier(null);
      },
      preserveScroll: true,
      preserveState: true,
      only: ["suppliers", "errors", "flash"],
    });
  }

  function handleDelete(supplierId) {
    if (confirm('Are you sure you want to delete this supplier?')) {
      router.delete(route('suppliers.destroy', supplierId), {
        preserveScroll: true,
        preserveState: true,
        only: ["suppliers", "flash"],
      });
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Suppliers</h1>
          
          {/* Add Supplier Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>
                  Enter the details for the new supplier. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Supplier Name *
                  </Label>
                  <div className="col-span-3">
                    <Input id="name" placeholder="Enter supplier name" value={data.name} onChange={e => setData('name', e.target.value)} />
                    {errors.name && (
                      <InputError message={errors.name} className="mt-2" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <div className="col-span-3">
                    <Input id="phone" placeholder="+233 XX XXX XXXX" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                    {errors.phone && (
                      <InputError message={errors.phone} className="mt-2" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="additional_info" className="text-right">
                    Additional Info
                  </Label>
                  <div className="col-span-3">
                    <Textarea id="additional_info" placeholder="Notes or info" value={data.additional_info} onChange={e => setData('additional_info', e.target.value)} />
                    {errors.additional_info && (
                      <InputError message={errors.additional_info} className="mt-2" />
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={processing}>Add Supplier</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Supplier Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Supplier</DialogTitle>
              <DialogDescription>
                Update the supplier information. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Supplier Name *
                </Label>
                <div className="col-span-3">
                  <Input id="edit-name" placeholder="Enter supplier name" value={data.name} onChange={e => setData('name', e.target.value)} />
                  {errors.name && (
                    <InputError message={errors.name} className="mt-2" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone
                </Label>
                <div className="col-span-3">
                  <Input id="edit-phone" placeholder="+233 XX XXX XXXX" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                  {errors.phone && (
                    <InputError message={errors.phone} className="mt-2" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-additional_info" className="text-right">
                  Additional Info
                </Label>
                <div className="col-span-3">
                  <Textarea id="edit-additional_info" placeholder="Notes or info" value={data.additional_info} onChange={e => setData('additional_info', e.target.value)} />
                  {errors.additional_info && (
                    <InputError message={errors.additional_info} className="mt-2" />
                  )}
                </div>
              </div>
              <Button type="submit" disabled={processing}>Update Supplier</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Suppliers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Supplier Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Additional Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {supplier.phone || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={supplier.additional_info}>
                      {supplier.additional_info || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.is_active ? "default" : "secondary"}>
                        {supplier.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(supplier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(supplier.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {suppliers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No suppliers found. Add your first supplier to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Suppliers; 