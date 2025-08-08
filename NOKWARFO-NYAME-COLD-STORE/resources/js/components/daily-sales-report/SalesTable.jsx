import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SalesTable({ title, sales, amountTotal, amountColor }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sales.map((sale, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{sale.time}</TableCell>
                                <TableCell className="font-medium">{sale.customer}</TableCell>
                                <TableCell>{sale.products}</TableCell>
                                <TableCell className="font-medium">GH₵{parseFloat(sale.amount).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow className={amountColor === 'text-green-600' ? 'bg-green-50' : 'bg-orange-50'}>
                            <TableCell colSpan={3} className="font-bold">
                                Total {title}
                            </TableCell>
                            <TableCell className={`font-bold ${amountColor}`}>GH₵{amountTotal.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
