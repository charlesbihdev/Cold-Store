import { useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Edit, Trash2, Phone, Mail, MapPin, CreditCard } from "lucide-react"
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/InputError';
import { useState } from 'react';
import { router } from '@inertiajs/react';

function Customers() {
  const { customers = [] } = usePage().props;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    phone: '',
    email: '',
    address: '',
    credit_limit: '',
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const breadcrumbs = [
    { title: 'Customers', href: '/customers' },
  ];

  const getCreditStatus = (customer) => {
    if (customer.current_balance === 0) {
      return { status: 'good', label: 'No Balance', color: 'bg-green-100 text-green-800' };
    }
    if (customer.current_balance > customer.credit_limit) {
      return { status: 'over', label: 'Over Limit', color: 'bg-red-100 text-red-800' };
    }
    return { status: 'pending', label: 'Has Balance', color: 'bg-yellow-100 text-yellow-800' };
  };

  function handleSubmit(e) {
    e.preventDefault();
    post(route('customers.store'), {
      onSuccess: () => {
        reset();
        setIsAddModalOpen(false);
      },
    });
  }

  function handleEdit(customer) {
    setEditingCustomer(customer);
    setData({
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
      credit_limit: customer.credit_limit || '',
    });
    setIsEditModalOpen(true);
  }

  function handleUpdate(e) {
    e.preventDefault();
    put(route('customers.update', editingCustomer.id), {
      onSuccess: () => {
        reset();
        setIsEditModalOpen(false);
        setEditingCustomer(null);
      },
      preserveScroll: true,
      preserveState: true,
      only: ["customers", "errors", "flash"],
    });
  }

  function handleDelete(customerId) {
    if (confirm('Are you sure you want to delete this customer?')) {
      router.delete(route('customers.destroy', customerId), {
        preserveScroll: true,
        preserveState: true,
        only: ["customers", "flash"],
      });
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Customers</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer-name" className="text-right">
                    Customer Name
                  </Label>
                  <Input id="customer-name" className="col-span-3" placeholder="Enter customer name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" className="col-span-3" placeholder="+233 XX XXX XXXX" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" type="email" className="col-span-3" placeholder="customer@email.com" value={data.email} onChange={e => setData('email', e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Textarea id="address" className="col-span-3" placeholder="Customer address" value={data.address} onChange={e => setData('address', e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="credit-limit" className="text-right">
                    Credit Limit (GH₵)
                  </Label>
                  <Input id="credit-limit" type="number" step="0.01" className="col-span-3" placeholder="0.00" value={data.credit_limit} onChange={e => setData('credit_limit', e.target.value)} />
                </div>
                <Button type="submit" disabled={processing}>Add Customer</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">Active customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credit Limit</CardTitle>
              <CreditCard className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                GH₵{customers.reduce((sum, c) => sum + parseFloat(c.credit_limit), 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Available credit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                GH₵{customers.reduce((sum, c) => sum + parseFloat(c.current_balance), 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Total owed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                GH₵{customers.reduce((sum, c) => sum + (parseFloat(c.credit_limit) - parseFloat(c.current_balance)), 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Remaining credit</p>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => {
                  const creditStatus = getCreditStatus(customer);
                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {customer.address}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        GH₵{parseFloat(customer.credit_limit).toFixed(2)}
                      </TableCell>
                      <TableCell className="font-medium">
                        <span className={customer.current_balance > 0 ? "text-orange-600" : "text-green-600"}>
                          GH₵{parseFloat(customer.current_balance).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={creditStatus.color}>
                          {creditStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(customer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(customer.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Customer Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-customer-name" className="text-right">
                Customer Name
              </Label>
              <Input id="edit-customer-name" className="col-span-3" placeholder="Enter customer name" value={data.name} onChange={e => setData('name', e.target.value)} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Phone
              </Label>
              <Input id="edit-phone" className="col-span-3" placeholder="+233 XX XXX XXXX" value={data.phone} onChange={e => setData('phone', e.target.value)} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input id="edit-email" type="email" className="col-span-3" placeholder="customer@email.com" value={data.email} onChange={e => setData('email', e.target.value)} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                Address
              </Label>
              <Textarea id="edit-address" className="col-span-3" placeholder="Customer address" value={data.address} onChange={e => setData('address', e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-credit-limit" className="text-right">
                Credit Limit (GH₵)
              </Label>
              <Input id="edit-credit-limit" type="number" step="0.01" className="col-span-3" placeholder="0.00" value={data.credit_limit} onChange={e => setData('credit_limit', e.target.value)} />
            </div>
            <Button type="submit" disabled={processing}>Update Customer</Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}

export default Customers; 