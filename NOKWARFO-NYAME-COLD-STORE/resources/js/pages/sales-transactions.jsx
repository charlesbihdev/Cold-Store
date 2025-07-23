import InputError from '@/components/InputError';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react'; // Added for useEffect

function SalesTransactions({ sales_transactions = [], products = [], customers = [] }) {
    console.log('Sales Transactions:', sales_transactions);
    const [open, setOpen] = useState(false);
    // const [deletingId, setDeletingId] = useState(null);
    // Form handling with destructured useForm
    const { data, setData, post, processing, errors, reset, setError } = useForm({
        customer_id: '',
        items: [{ product_id: '', qty: '', unit_cost: '', total: '' }],
        amount_paid: '',
        due_date: '',
        payment_type: 'cash',
    });

    // console.log(errors);

    // Remove unnecessary useEffects since we're using form data directly

    // Calculate running total
    const runningTotal = data.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

    // Ensure amount_paid is always runningTotal for cash
    useEffect(() => {
        if (data.payment_type === 'cash') {
            setData('amount_paid', runningTotal.toString());
        }
        if (data.payment_type === 'credit') {
            setData('amount_paid', '0');
        }
    }, [data.payment_type, runningTotal]);

    const handleOpen = () => {
        reset();
        setData({
            customer_id: '',
            items: [{ product_id: '', qty: '', unit_cost: '', total: '' }],
            amount_paid: '',
            due_date: '',
            payment_type: 'cash',
        });
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        reset();
        setData({
            customer_id: '',
            items: [{ product_id: '', qty: '', unit_cost: '', total: '' }],
            amount_paid: '',
            due_date: '',
            payment_type: 'cash',
        });
    };
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     post(route('sales-transactions.store'), {
    //         onSuccess: () => {
    //             reset();
    //             setOpen(false);
    //         },
    //         preserveScroll: true,
    //         preserveState: true,
    //         only: ['sales_transactions', 'errors', 'flash'],
    //     });
    // };
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            router.delete(route('sales-transactions.destroy', { id }));
        }
    };
    // Cart logic
    const handleItemChange = (idx, field, value) => {
        const newItems = data.items.map((item, i) =>
            i === idx
                ? {
                      ...item,
                      [field]: value,
                      total:
                          field === 'qty' || field === 'unit_cost'
                              ? field === 'qty'
                                  ? value * (item.unit_cost || 0)
                                  : (item.qty || 0) * value
                              : item.total,
                  }
                : item,
        );
        setData('items', newItems);
    };
    const addItem = () => {
        setData('items', [...data.items, { product_id: '', qty: '', unit_cost: '', total: '' }]);
    };
    const removeItem = (idx) => {
        if (data.items.length === 1) return;
        setData(
            'items',
            data.items.filter((_, i) => i !== idx),
        );
    };
    // Payment logic
    const handleAmountPaidChange = (v) => {
        setData('amount_paid', v);
        if (data.payment_type === 'partial') {
            if (parseFloat(v) <= 0 || parseFloat(v) >= runningTotal) {
                setError('amount_paid', 'For partial payments, the amount paid must be greater than 0 and less than the total.');
            } else {
                setError('amount_paid', undefined);
            }
        }
    };
    const handlePaymentTypeChange = (v) => {
        setData('payment_type', v);
        if (v === 'credit') {
            setData('amount_paid', '0');
            setError('amount_paid', undefined);
        } else if (v === 'cash') {
            setData('amount_paid', runningTotal.toString());
            setError('amount_paid', undefined);
        } else if (v === 'partial') {
            setData('amount_paid', '');
            setError('amount_paid', undefined);
        }
    };

    const breadcrumbs = [{ title: 'Sales Transactions', href: '/sales-transactions' }];

    // Summary calculations
    const totalAmount = sales_transactions.reduce((sum, t) => sum + parseFloat(t.total), 0);

    // Cash sales: sum amount_paid for Cash and Partial
    const cashAmount = sales_transactions
        .filter((t) => t.payment_type === 'Cash' || t.payment_type === 'Partial')
        .reduce((sum, t) => sum + parseFloat(t.amount_paid), 0);

    // Credit sales: sum total for credit + amount_owed for partial
    const creditAmount =
        sales_transactions.filter((t) => t.payment_type === 'Credit').reduce((sum, t) => sum + parseFloat(t.total), 0) +
        sales_transactions.filter((t) => t.payment_type === 'Partial').reduce((sum, t) => sum + parseFloat(t.total - t.amount_paid), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen space-y-6 bg-gray-100 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Sales & Transactions</h1>
                    <Button onClick={handleOpen}>Add Transaction</Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">GH₵{(cashAmount + creditAmount).toFixed(2)}</div>
                            <p className="text-muted-foreground text-xs">All transactions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cash Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">GH₵{cashAmount.toFixed(2)}</div>
                            <p className="text-muted-foreground text-xs">Cash payments</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Credit Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">GH₵{creditAmount.toFixed(2)}</div>
                            <p className="text-muted-foreground text-xs">Credit payments</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sales Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Unit Cost</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Payment Type</TableHead>
                                    <TableHead>Amount Paid</TableHead>
                                    <TableHead>Amount Owed</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sales_transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell className="font-medium">{transaction.id}</TableCell>
                                        <TableCell>{transaction.date}</TableCell>
                                        <TableCell>{transaction.customer}</TableCell>
                                        <TableCell>
                                            {transaction.sale_items.map((item, idx) => (
                                                <div key={idx}>{item.product}</div>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            {transaction.sale_items.map((item, idx) => (
                                                <div key={idx}>{item.quantity}</div>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            {transaction.sale_items.map((item, idx) => (
                                                <div key={idx}>GH₵{parseFloat(item.unit_cost).toFixed(2)}</div>
                                            ))}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {transaction.sale_items.map((item, idx) => (
                                                <div key={idx}>GH₵{parseFloat(item.total).toFixed(2)}</div>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    transaction.status === 'Partial'
                                                        ? 'secondary'
                                                        : transaction.payment_type === 'Cash'
                                                          ? 'default'
                                                          : 'secondary'
                                                }
                                            >
                                                {transaction.status === 'Partial' ? 'Partial' : transaction.payment_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>GH₵{parseFloat(transaction.amount_paid).toFixed(2)}</TableCell>
                                        <TableCell>GH₵{parseFloat(transaction.amount_owed).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    transaction.status === 'Completed'
                                                        ? 'default'
                                                        : transaction.status === 'Partial'
                                                          ? 'secondary'
                                                          : transaction.status === 'Credit'
                                                            ? 'outline'
                                                            : 'secondary'
                                                }
                                            >
                                                {transaction.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(transaction.id)}
                                                className="text-white"
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                {/* Add Transaction Modal */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Sales Transaction</DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                // Client-side validation before submit
                                if (data.payment_type === 'cash' && parseFloat(data.amount_paid) !== runningTotal) {
                                    setError('amount_paid', 'For cash payments, the amount paid must equal the total.');
                                    return;
                                }
                                if (data.payment_type === 'credit' && parseFloat(data.amount_paid) !== 0) {
                                    setError('amount_paid', 'For credit sales, the amount paid must be 0.');
                                    return;
                                }
                                if (
                                    data.payment_type === 'partial' &&
                                    (parseFloat(data.amount_paid) <= 0 || parseFloat(data.amount_paid) >= runningTotal)
                                ) {
                                    setError('amount_paid', 'For partial payments, the amount paid must be greater than 0 and less than the total.');
                                    return;
                                }
                                post(route('sales-transactions.store'), {
                                    onSuccess: () => handleClose(),
                                });
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-1 block font-medium">Customer</label>
                                <Select value={data.customer_id} onValueChange={(v) => setData('customer_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)} required>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.customer_id && <InputError message={errors.customer_id} className="mt-2" />}
                            </div>
                            {/* Cart Items */}
                            <div>
                                <label className="mb-1 block font-medium">Items</label>
                                <div className="max-h-64 space-y-2 overflow-y-auto">
                                    {data.items.map((item, idx) => (
                                        <div key={idx} className="flex w-full flex-wrap items-end gap-2">
                                            <div className="min-w-[120px] flex-1">
                                                <Select value={item.product_id} onValueChange={(v) => handleItemChange(idx, 'product_id', v)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Product" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {products.map((p) => (
                                                            <SelectItem key={p.id} value={String(p.id)}>
                                                                {p.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="w-20 min-w-[70px]">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    placeholder="Qty"
                                                    value={item.qty}
                                                    onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                                                />
                                            </div>
                                            <div className="w-24 min-w-[90px]">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="Unit Cost"
                                                    value={item.unit_cost}
                                                    onChange={(e) => handleItemChange(idx, 'unit_cost', e.target.value)}
                                                />
                                            </div>
                                            <div className="w-24 min-w-[90px]">
                                                <Input type="number" min="0" step="0.01" placeholder="Total" value={item.total} readOnly />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="text-white"
                                                onClick={() => removeItem(idx)}
                                                disabled={data.items.length === 1}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                        Add Item
                                    </Button>
                                </div>
                                {Object.keys(errors).map((key) => {
                                    if (key.startsWith('items')) {
                                        return (
                                            <div key={key} className="mt-1 text-xs text-red-500">
                                                {errors[key].replace(/items\.\d+\./, '')}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            {/* Running Total */}
                            <div className="text-lg font-bold">Total: GH₵{runningTotal.toFixed(2)}</div>
                            {/* Payment Section */}
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="mb-1 block font-medium">Payment Type</label>
                                    <Select value={data.payment_type} onValueChange={handlePaymentTypeChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="credit">Credit</SelectItem>
                                            <SelectItem value="partial">Partial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.payment_type && <div className="mt-1 text-xs text-red-500">{errors.payment_type}</div>}
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block font-medium">Amount Paid</label>
                                    <Input
                                        type="number"
                                        min={data.payment_type === 'partial' ? 1 : 0}
                                        max={data.payment_type === 'partial' ? runningTotal - 1 : runningTotal}
                                        step="0.01"
                                        value={data.amount_paid}
                                        onChange={(e) => handleAmountPaidChange(e.target.value)}
                                        disabled={data.payment_type === 'credit' || data.payment_type === 'cash'}
                                    />
                                    {errors.amount_paid && <InputError message={errors.amount_paid} className="mt-2" />}
                                </div>
                                {data.payment_type !== 'cash' && (
                                    <div className="flex-1">
                                        <label className="mb-1 block font-medium">Due Date</label>
                                        <Input type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
                                        {errors.due_date && <div className="mt-1 text-xs text-red-500">{errors.due_date}</div>}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button type="submit">{processing ? 'Saving..' : 'Save'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

export default SalesTransactions;
