import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ProductsTable({ title, products, totalQty, totalAmount, totalAmountColor, showAmountPaid = false, totalAmountPaid = 0 }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total Amount</TableHead>
                            {showAmountPaid && <TableHead>Amount Paid</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="font-medium">{item.product}</TableCell>
                                <TableCell>{item.qty}</TableCell>
                                <TableCell className="font-medium">GH₵{parseFloat(item.total_amount).toFixed(2)}</TableCell>
                                {showAmountPaid && <TableCell className="font-medium">GH₵{parseFloat(item.amount_paid).toFixed(2)}</TableCell>}
                            </TableRow>
                        ))}
                        <TableRow
                            className={`bg-${totalAmountColor === 'text-green-600' ? 'green' : totalAmountColor === 'text-orange-600' ? 'orange' : 'yellow'}-50`}
                        >
                            <TableCell className="font-bold">Total Products</TableCell>
                            <TableCell className="font-bold">{totalQty}</TableCell>
                            <TableCell className={`font-bold ${totalAmountColor}`}>GH₵{totalAmount.toFixed(2)}</TableCell>
                            {showAmountPaid && <TableCell className="font-bold text-green-600">GH₵{totalAmountPaid.toFixed(2)}</TableCell>}
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
