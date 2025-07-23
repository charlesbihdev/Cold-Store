import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import { Banknote, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

function BankTransfers() {
    const [tagForm, setTagForm] = useState({ name: '' });
    const { bank_transfers = [], tags = [], lastBalance = 0 } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        date: new Date().toISOString().split('T')[0],
        previous_balance: lastBalance.toString(),
        credit: '0',
        total_balance: lastBalance.toString(),
        debit: '0',
        tag_id: '',
        current_balance: lastBalance.toString(),
        notes: '',
    });

    // Auto-calculate balances when values change
    useEffect(() => {
        const prevBalance = parseFloat(data.previous_balance) || 0;
        const credit = parseFloat(data.credit) || 0;
        const total = prevBalance + credit;
        const debit = parseFloat(data.debit) || 0;

        setData((prevData) => ({
            ...prevData,
            total_balance: total.toString(),
            current_balance: (total - debit).toString(),
        }));
    }, [data.previous_balance, data.credit, data.debit]);

    const breadcrumbs = [{ title: 'Bank Transfers', href: '/bank-transfers' }];

    const [tagErrors, setTagErrors] = useState({});

    function handleTagSubmit(e) {
        if (e) e.preventDefault();
        if (!tagForm.name.trim()) return;

        post(route('bank-transfer-tags.store'), {
            preserveScroll: true,
            data: tagForm,
            onSuccess: () => {
                setTagForm({ name: '' });
                setTagErrors({});
            },
            onError: (errors) => {
                setTagErrors(errors);
            },
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('bank-transfers.store'), {
            onSuccess: () => reset(),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen space-y-6 bg-gray-100 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Bank Transfers</h1>
                    <div className="flex items-center space-x-4">
                        {/* Tag Creation Form */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 space-y-1">
                                    <Input
                                        placeholder="New tag name"
                                        value={tagForm.name}
                                        onChange={(e) => setTagForm({ name: e.target.value })}
                                        className={`w-48 ${tagErrors.name ? 'border-red-500' : ''}`}
                                    />
                                    {tagErrors.name && <div className="text-sm text-red-500">{tagErrors.name}</div>}
                                </div>
                                <Button onClick={handleTagSubmit} variant="outline" disabled={!tagForm.name.trim()}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Tag
                                </Button>
                            </div>
                        </div>

                        {/* Transfer Dialog */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Record Transfer
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Record Bank Transfer</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Date</Label>
                                            <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                                            {errors.date && <div className="text-sm text-red-500">{errors.date}</div>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="previous_balance">Previous Balance</Label>
                                            <Input
                                                id="previous_balance"
                                                type="number"
                                                step="0.01"
                                                value={data.previous_balance}
                                                onChange={(e) => setData('previous_balance', e.target.value)}
                                            />
                                            {errors.previous_balance && <div className="text-sm text-red-500">{errors.previous_balance}</div>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="credit">Credit Amount</Label>
                                            <Input
                                                id="credit"
                                                type="number"
                                                step="0.01"
                                                value={data.credit}
                                                onChange={(e) => setData('credit', e.target.value)}
                                            />
                                            {errors.credit && <div className="text-sm text-red-500">{errors.credit}</div>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="total_balance">Total Balance</Label>
                                            <Input id="total_balance" type="number" step="0.01" value={data.total_balance} readOnly />
                                            {errors.total_balance && <div className="text-sm text-red-500">{errors.total_balance}</div>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="debit">Debit Amount</Label>
                                            <Input
                                                id="debit"
                                                type="number"
                                                step="0.01"
                                                value={data.debit}
                                                onChange={(e) => setData('debit', e.target.value)}
                                            />
                                            {errors.debit && <div className="text-sm text-red-500">{errors.debit}</div>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tag">Tag</Label>
                                            <Select value={data.tag_id} onValueChange={(value) => setData('tag_id', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a tag" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {tags.map((tag) => (
                                                        <SelectItem key={tag.id} value={tag.id.toString()}>
                                                            {tag.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.tag_id && <div className="text-sm text-red-500">{errors.tag_id}</div>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="current_balance">Current Balance</Label>
                                            <Input id="current_balance" type="number" step="0.01" value={data.current_balance} readOnly />
                                            {errors.current_balance && <div className="text-sm text-red-500">{errors.current_balance}</div>}
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="notes">Notes</Label>
                                            <textarea
                                                id="notes"
                                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="Enter any additional notes..."
                                            />
                                            {errors.notes && <div className="text-sm text-red-500">{errors.notes}</div>}
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Recording...' : 'Record Transfer'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
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
                                    <TableHead>Tag</TableHead>
                                    <TableHead>Current Balance</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bank_transfers.length > 0 ? (
                                    bank_transfers.map((transfer) => (
                                        <TableRow key={transfer.id}>
                                            <TableCell>{transfer.date}</TableCell>
                                            <TableCell>GH₵{parseFloat(transfer.previous_balance || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-green-600">GH₵{parseFloat(transfer.credit || 0).toFixed(2)}</TableCell>
                                            <TableCell>GH₵{parseFloat(transfer.total_balance || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-red-600">GH₵{parseFloat(transfer.debit || 0).toFixed(2)}</TableCell>
                                            <TableCell>{transfer.tag?.name || 'No tag'}</TableCell>
                                            <TableCell className="font-medium">GH₵{parseFloat(transfer.current_balance || 0).toFixed(2)}</TableCell>
                                            <TableCell>{transfer.notes || '-'}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-muted-foreground text-center">
                                            No bank transfers recorded yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

export default BankTransfers;
