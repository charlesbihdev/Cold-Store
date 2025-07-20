import { useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Banknote } from "lucide-react"
import AppLayout from '@/layouts/app-layout';

function BankTransfers() {
  const { bank_transfers = [] } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    date: '',
    previous_balance: '',
    credit: '',
    total_balance: '',
    debit: '',
    debit_tag: '',
    current_balance: '',
    custom_tag: '',
    notes: '',
  });

  const breadcrumbs = [
    { title: 'Bank Transfers', href: '/bank-transfers' },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    post(route('bank-transfers.store'), {
      onSuccess: () => reset(),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bank Transfers</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record Transfer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record Bank Transfer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                {/* Add your bank transfer form fields here */}
                <Button type="submit" disabled={processing}>Record Transfer</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bank Transfers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Bank Transfer Ledger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Previous Balance</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Total Balance</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Debit Tag</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Custom Tag</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bank_transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell>GH₵{parseFloat(transfer.previous_balance).toFixed(2)}</TableCell>
                    <TableCell className="text-green-600">GH₵{parseFloat(transfer.credit).toFixed(2)}</TableCell>
                    <TableCell>GH₵{parseFloat(transfer.total_balance).toFixed(2)}</TableCell>
                    <TableCell className="text-red-600">GH₵{parseFloat(transfer.debit).toFixed(2)}</TableCell>
                    <TableCell>{transfer.debit_tag}</TableCell>
                    <TableCell className="font-medium">GH₵{parseFloat(transfer.current_balance).toFixed(2)}</TableCell>
                    <TableCell>{transfer.custom_tag}</TableCell>
                    <TableCell>{transfer.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default BankTransfers; 