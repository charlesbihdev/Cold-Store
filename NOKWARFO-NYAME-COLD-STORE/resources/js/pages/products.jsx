import InputError from '@/components/InputError';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { router, useForm } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Edit, Package, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

function Products({ products = [], suppliers = [], errors = {} }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingPrice, setEditingPrice] = useState(null);

    // Form for product data
    const {
        data: productData,
        setData: setProductData,
        post: postProduct,
        put: putProduct,
        processing: productProcessing,
        reset: resetProduct,
        errors: productErrors,
    } = useForm({
        name: '',
        description: '',
        category: '',
        supplier_id: '',
    });

    // Form for product price data
    const {
        data: productPriceData,
        setData: setProductPriceData,
        post: postPrice,
        put: putPrice,
        processing: priceProcessing,
        reset: resetPrice,
        errors: priceErrors,
    } = useForm({
        product_id: '',
        selling_price: '',
        valid_from: '',
    });

    const breadcrumbs = [{ title: 'Products', href: '/products' }];

    // Handle product form submission
    function handleProductSubmit(e) {
        e.preventDefault();
        postProduct(route('products.store'), {
            onSuccess: () => {
                resetProduct();
                setIsAddModalOpen(false);
            },
            preserveScroll: true,
            preserveState: true,
            only: ['products', 'errors', 'flash'],
        });
    }

    // Handle product edit
    function handleEditProduct(product) {
        setEditingProduct(product);
        setProductData({
            name: product.name,
            description: product.description || '',
            category: product.category,
            supplier_id: product.supplier_id ? product.supplier_id.toString() : '',
        });
        setIsEditModalOpen(true);
    }

    // Handle product update
    function handleUpdateProduct(e) {
        e.preventDefault();
        putProduct(route('products.update', editingProduct.id), {
            onSuccess: () => {
                resetProduct();
                setIsEditModalOpen(false);
                setEditingProduct(null);
            },
            preserveScroll: true,
            preserveState: true,
            only: ['products', 'errors', 'flash'],
        });
    }

    // Handle product deletion
    function handleDeleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('products.destroy', productId), {
                preserveScroll: true,
                preserveState: true,
                only: ['products', 'flash'],
            });
        }
    }

    // Handle price form submission
    function handlePriceSubmit(e) {
        e.preventDefault();
        const routeName = editingPrice ? 'product-prices.update' : 'product-prices.store';
        const method = editingPrice ? putPrice : postPrice;
        method(route(routeName, editingPrice ? editingPrice.id : null), {
            onSuccess: () => {
                resetPrice();
                setIsPriceModalOpen(false);
                setSelectedProduct(null);
                setEditingPrice(null);
            },
            preserveScroll: true,
            preserveState: true,
            only: ['products', 'errors', 'flash'],
        });
    }

    // Handle price edit
    function handleEditPrice(price, product) {
        setSelectedProduct(product);
        setEditingPrice(price);
        setProductPriceData({
            product_id: product.id.toString(),
            selling_price: price.selling_price.toString(),
            valid_from: price.valid_from.split('T')[0], // Convert to YYYY-MM-DD
            valid_to: price.valid_to ? price.valid_to.split('T')[0] : '',
        });
        setIsPriceModalOpen(true);
    }

    // Handle opening add price modal
    function handleAddPrice(product) {
        setSelectedProduct(product);
        setProductPriceData({
            product_id: product.id.toString(),
            selling_price: '',
            valid_from: '',
        });
        setIsPriceModalOpen(true);
    }

    // Handle price deletion
    function handleDeletePrice(priceId) {
        if (confirm('Are you sure you want to delete this price?')) {
            router.delete(route('product-prices.destroy', priceId), {
                preserveScroll: true,
                preserveState: true,
                only: ['products', 'flash'],
            });
        }
    }

    // Format date to human-readable (e.g., 26 July 2025)
    function formatDate(isoDate) {
        if (!isoDate) return 'Ongoing';
        try {
            return format(parseISO(isoDate), 'dd MMMM yyyy');
        } catch (error) {
            return isoDate; // Fallback to raw date if parsing fails
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen space-y-6 bg-gray-100 p-6">
                {/* Info alert for users about catalog vs inventory */}
                <div className="mb-4 rounded border border-blue-200 bg-blue-50 p-4 text-blue-900">
                    <strong>Note:</strong> This page is for managing your <b>product catalog</b> only.
                    <br />
                    <ul className="mt-2 list-disc pl-6">
                        <li>Add, edit, or remove product details (name, price, supplier, etc.) here.</li>
                        <li>
                            <b>
                                All stock changes (add, remove, adjust) are done in <u>Inventory Management</u>, not here.
                            </b>
                        </li>
                        <li>Think of this as your “master list” of what you could possibly have in your store.</li>
                    </ul>
                </div>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Products</h1>

                    {/* Add Product Modal */}
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setIsAddModalOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                                <DialogDescription>Enter the product details. All fields marked with * are required.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleProductSubmit} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Product Name *
                                    </Label>
                                    <div className="col-span-3">
                                        <Input
                                            id="name"
                                            placeholder="Enter product name"
                                            value={productData.name}
                                            onChange={(e) => setProductData('name', e.target.value)}
                                            required
                                        />
                                        {productErrors.name && <InputError message={productErrors.name} className="mt-2" />}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">
                                        Description
                                    </Label>
                                    <div className="col-span-3">
                                        <Input
                                            id="description"
                                            placeholder="Product description"
                                            value={productData.description}
                                            onChange={(e) => setProductData('description', e.target.value)}
                                        />
                                        {productErrors.description && <InputError message={productErrors.description} className="mt-2" />}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category" className="text-right">
                                        Category *
                                    </Label>
                                    <div className="col-span-3">
                                        <Input
                                            id="category"
                                            placeholder="e.g., Frozen, Chilled, Beverages"
                                            value={productData.category}
                                            onChange={(e) => setProductData('category', e.target.value)}
                                            required
                                        />
                                        {productErrors.category && <InputError message={productErrors.category} className="mt-2" />}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="supplier" className="text-right">
                                        Supplier *
                                    </Label>
                                    <div className="col-span-3">
                                        <Select
                                            value={productData.supplier_id}
                                            onValueChange={(value) => setProductData('supplier_id', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {suppliers.map((supplier) => (
                                                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                                        {supplier.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {productErrors.supplier_id && <InputError message={productErrors.supplier_id} className="mt-2" />}
                                    </div>
                                </div>
                                <Button type="submit" disabled={productProcessing}>
                                    Add Product
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Edit Product Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                            <DialogDescription>Update the product information. All fields marked with * are required.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdateProduct} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                    Product Name *
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="edit-name"
                                        placeholder="Enter product name"
                                        value={productData.name}
                                        onChange={(e) => setProductData('name', e.target.value)}
                                        required
                                    />
                                    {productErrors.name && <InputError message={productErrors.name} className="mt-2" />}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-description" className="text-right">
                                    Description
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="edit-description"
                                        placeholder="Product description"
                                        value={productData.description}
                                        onChange={(e) => setProductData('description', e.target.value)}
                                    />
                                    {productErrors.description && <InputError message={productErrors.description} className="mt-2" />}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-category" className="text-right">
                                    Category *
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="edit-category"
                                        placeholder="e.g., Frozen, Chilled, Beverages"
                                        value={productData.category}
                                        onChange={(e) => setProductData('category', e.target.value)}
                                        required
                                    />
                                    {productErrors.category && <InputError message={productErrors.category} className="mt-2" />}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-supplier" className="text-right">
                                    Supplier *
                                </Label>
                                <div className="col-span-3">
                                    <Select value={productData.supplier_id} onValueChange={(value) => setProductData('supplier_id', value)} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {suppliers.map((supplier) => (
                                                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                                    {supplier.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {productErrors.supplier_id && <InputError message={productErrors.supplier_id} className="mt-2" />}
                                </div>
                            </div>
                            <Button type="submit" disabled={productProcessing}>
                                Update Product
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Add/Edit Product Price Modal */}
                <Dialog open={isPriceModalOpen} onOpenChange={setIsPriceModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingPrice ? 'Edit Product Price' : 'Add Product Price'}</DialogTitle>
                            <DialogDescription>
                                {editingPrice ? 'Update the price details for this product.' : 'Enter the price details for this product.'} All fields
                                marked with * are required.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePriceSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="selling_price" className="text-right">
                                    Selling Price (₵) *
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="selling_price"
                                        type="number"
                                        step="0.01"
                                        placeholder="Enter selling price in Cedis"
                                        value={productPriceData.selling_price}
                                        onChange={(e) => setProductPriceData('selling_price', e.target.value)}
                                        required
                                    />
                                    {priceErrors.selling_price && <InputError message={priceErrors.selling_price} className="mt-2" />}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="valid_from" className="text-right">
                                    Valid From *
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="valid_from"
                                        type="date"
                                        value={productPriceData.valid_from}
                                        onChange={(e) => setProductPriceData('valid_from', e.target.value)}
                                        required
                                    />
                                    {priceErrors.valid_from && <InputError message={priceErrors.valid_from} className="mt-2" />}
                                </div>
                            </div>
                            {/* <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="valid_to" className="text-right">
                                    Valid To
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="valid_to"
                                        type="date"
                                        value={productPriceData.valid_to}
                                        onChange={(e) => setProductPriceData('valid_to', e.target.value)}
                                    />
                                    {priceErrors.valid_to && <InputError message={priceErrors.valid_to} className="mt-2" />}
                                </div>
                            </div> */}
                            <Button type="submit" disabled={priceProcessing}>
                                {editingPrice ? 'Update Price' : 'Add Price'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Products List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Product Directory
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>{product.supplier?.name || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleAddPrice(product)}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {products.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                                            No products found. Add your first product to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Product Prices List */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Product Prices
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Selling Price (₵)</TableHead>
                                    <TableHead>Valid From</TableHead>
                                    {/* <TableHead>Valid To</TableHead> */}
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.flatMap((product) =>
                                    (product.prices || []).map((price) => (
                                        <TableRow key={price.id}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>₵{price.selling_price}</TableCell>
                                            <TableCell>{formatDate(price.valid_from)}</TableCell>
                                            {/* <TableCell>{formatDate(price.valid_to)}</TableCell> */}
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEditPrice(price, product)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDeletePrice(price.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )),
                                )}
                                {products.every((product) => (product.prices || []).length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                                            No prices found. Add prices to products to get started.
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

export default Products;
