import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowRightLeft, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Layout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/stock', label: 'Stock', icon: Package },
        { path: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-primary">BizManager</h1>
                    <p className="text-xs text-gray-500">Welcome, {user?.name}</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100 hidden">

                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b border-gray-200 p-4 md:hidden flex justify-between items-center">
                    <h1 className="font-bold text-primary">BizManager</h1>
                </header>
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
