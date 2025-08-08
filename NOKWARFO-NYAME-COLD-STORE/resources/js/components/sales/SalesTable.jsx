import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { Receipt } from 'lucide-react';
import { useState } from 'react';
import CreditReceipt from './CreditReceipt';
import InstantPaymentReceipt from './InstantPaymentReceipt';
import SearchBar from './SearchBar';

// Main Sales Table Component
const SalesTable = ({ sales_transactions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [receiptType, setReceiptType] = useState(null);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            router.delete(route('sales-transactions.destroy', id));
        }
    };

    // Handle receipt generation
    const handleGenerateReceipt = (transaction) => {
        setSelectedTransaction(transaction);
        if (transaction.status === 'Completed' && parseFloat(transaction.amount_owed) === 0) {
            setReceiptType('instant');
        } else {
            setReceiptType('credit');
        }
    };

    // Close receipt modal
    const closeReceipt = () => {
        setSelectedTransaction(null);
        setReceiptType(null);
    };

    // Filter transactions based on search term
    const filteredTransactions = sales_transactions.filter((transaction) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            transaction.id.toLowerCase().includes(searchLower) ||
            transaction.customer.toLowerCase().includes(searchLower) ||
            transaction.sale_items.some((item) => item.product.toLowerCase().includes(searchLower))
        );
    });

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Sales Transactions</CardTitle>
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
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
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Payment Type</TableHead>
                                <TableHead>Amount Paid</TableHead>
                                <TableHead>Amount Owed</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((transaction) => (
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
                                            <div key={idx}>GH₵{parseFloat(item.unit_selling_price).toFixed(2)}</div>
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
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleGenerateReceipt(transaction)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Receipt className="mr-1 h-4 w-4" />
                                                Receipt
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(transaction.id)}
                                                className="text-white"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredTransactions.length === 0 && (
                        <div className="text-muted-foreground py-8 text-center">No transactions found matching your search.</div>
                    )}
                </CardContent>
            </Card>

            {/* Receipt Modals */}
            {selectedTransaction && receiptType === 'instant' && <InstantPaymentReceipt transaction={selectedTransaction} onClose={closeReceipt} />}

            {selectedTransaction && receiptType === 'credit' && <CreditReceipt transaction={selectedTransaction} onClose={closeReceipt} />}
        </>
    );
};

export default SalesTable;
