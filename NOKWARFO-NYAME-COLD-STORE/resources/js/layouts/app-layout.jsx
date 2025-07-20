import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
    ChevronLeft, 
    ChevronRight, 
    Home, 
    Package, 
    Users, 
    ShoppingCart, 
    BarChart3, 
    Settings,
    Menu,
    X
} from 'lucide-react';
import ToastProvider from '@/components/ToastProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Suppliers', href: '/suppliers', icon: Users },
    { name: 'Sales', href: '/sales', icon: ShoppingCart },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function AppLayout({ children, breadcrumbs = [] }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');

    return (
        <SidebarProvider>
        <ToastProvider>
                <div className="min-h-screen w-full bg-gray-50 lg:flex">
                {/* Mobile sidebar */}
                <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
                            <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                    </div>
                </div>

                {/* Desktop sidebar */}
                    <div className="hidden lg:flex lg:w-64 lg:flex-col flex-shrink-0">
                        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                </div>

                {/* Main content */}
                    <div className="flex-1 flex flex-col min-w-0">
                    {/* Top bar */}
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        {/* Breadcrumbs */}
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-4">
                                {breadcrumbs.map((crumb, index) => (
                                    <li key={index}>
                                        <div className="flex items-center">
                                            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
                                            {index === breadcrumbs.length - 1 ? (
                                                <span className="text-sm font-medium text-gray-500">{crumb.title}</span>
                                            ) : (
                                                <Link
                                                    href={crumb.href}
                                                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                                >
                                                    {crumb.title}
                                                </Link>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>

                    {/* Page content */}
                    <main className="py-6">
        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
        </SidebarProvider>
    );
}

